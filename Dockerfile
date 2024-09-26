# Use a non-Alpine base image
FROM node:20 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies with verbose logging
RUN yarn install

### FEATURE REPORTER
# Install dependencies
WORKDIR /feature-reporter
COPY ./deploy/tools/feature-reporter/package.json ./deploy/tools/feature-reporter/yarn.lock ./
RUN yarn --frozen-lockfile


### ENV VARIABLES CHECKER
# Install dependencies
WORKDIR /envs-validator
COPY ./deploy/tools/envs-validator/package.json ./deploy/tools/envs-validator/yarn.lock ./
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate .env.registry with ENVs list and save build args into .env file
COPY ./deploy/scripts/collect_envs.sh ./
RUN ./collect_envs.sh ./docs/ENVS.md

# Build the Next.js application
RUN yarn build

### FEATURE REPORTER
# Copy dependencies and source code, then build
COPY --from=deps /feature-reporter/node_modules ./deploy/tools/feature-reporter/node_modules
RUN cd ./deploy/tools/feature-reporter && yarn compile_config
RUN cd ./deploy/tools/feature-reporter && yarn build


### ENV VARIABLES CHECKER
# Copy dependencies and source code, then build 
COPY --from=deps /envs-validator/node_modules ./deploy/tools/envs-validator/node_modules
RUN cd ./deploy/tools/envs-validator && yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

#COPY --from=builder /app/public ./public


COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder /app/deploy/tools/envs-validator/index.js ./envs-validator.js
COPY --from=builder /app/deploy/tools/feature-reporter/index.js ./feature-reporter.js

# Copy scripts
## Entripoint
COPY ./deploy/scripts/entrypoint.sh .
## ENV validator and client script maker
COPY ./deploy/scripts/validate_envs.sh .
COPY ./deploy/scripts/make_envs_script.sh .
## Assets downloader
COPY ./deploy/scripts/download_assets.sh .
## Favicon generator
COPY ./deploy/scripts/favicon_generator.sh .
COPY ./deploy/tools/favicon-generator ./deploy/tools/favicon-generator
RUN ["chmod", "-R", "777", "./deploy/tools/favicon-generator"]
RUN ["chmod", "-R", "777", "./public"]

# Copy ENVs files
COPY --from=builder /app/.env.registry .
COPY --from=builder /app/.env .

# Copy ENVs presets
ARG ENVS_PRESET
ENV ENVS_PRESET=$ENVS_PRESET
COPY ./configs/envs ./configs/envs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENTRYPOINT ["./entrypoint.sh"]

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]