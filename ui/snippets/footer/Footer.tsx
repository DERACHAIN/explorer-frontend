import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Link,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';

const socialNetworks = [
  {
    href: 'https://twitter.com/darenft',
    iconName: 'twitter',
    name: 'twitter',
  },
  {
    href: 'https://www.facebook.com/groups/darenft',
    iconName: 'facebook',
    name: 'facebook',
  },
  {
    href: 'https://medium.com/darenft',
    iconName: 'medium',
    name: 'medium',
  },
  {
    href: 'https://t.me/darenft_official',
    iconName: 'telegram',
    name: 'telegram',
  },
];

const contact = [
  { id: 1, name: 'About us' },
  { id: 2, name: 'Policy privacy' },
  { id: 3, name: 'Terms of Use' },
  { id: 4, name: 'Disclaimer' },
];

const Footer = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const hoverColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <Box as="footer" bg={ bgColor } borderTop="1px" borderColor={ borderColor }>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(10, 1fr)' }}
        gap={{ base: 10, xl: 8 }}
        px={{ base: 4, xl: 14, '2xl': 20 }}
        py={{ base: 10, lg: 14 }}
      >
        { /* Logo and brand section */ }
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Flex alignItems="center" mb={ 2 }>
            { /* Replace with your Image component */ }
            <Image src="/static/logo.svg" alt="Logo" marginRight={ 1 }/>
            { /* <Text fontSize="5xl" fontWeight="semibold" color="blue.500">
              Scan
            </Text> */ }
          </Flex>
          <Text color={ textColor } fontSize="md">
            A one-stop destination for web3 projects.
          </Text>
          <Flex alignItems="center" gap="4px">
            <Text color={ textColor } fontSize="xs">
              Powered by
              { /* Add your logo Image component here */ }
            </Text>
            <Image
              src="/static/logo.svg"
              alt="Logo"
              marginRight={ 1 }
              width="64px"
            />
          </Flex>
        </GridItem>

        { /* Contact links */ }
        <GridItem colSpan={{ base: 1, lg: 3 }} ml={{ sm: 20, xl: 28 }}>
          <VStack as="ul" alignItems="flex-start" spacing={ 6 }>
            { contact.map((item) => (
              <Box
                key={ item.id }
                as="li"
                listStyleType="disc"
                color={ textColor }
                _hover={{
                  color: hoverColor,
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
                cursor="pointer"
              >
                { item.name }
              </Box>
            )) }
          </VStack>
        </GridItem>

        { /* Social networks */ }
        <GridItem colSpan={{ base: 1, lg: 2 }} ml={{ sm: -10, xl: -20 }}>
          <VStack
            alignItems="flex-start"
            spacing={ 5 }
            mt={{ base: 10, lg: 0 }}
            ml={{ lg: -14 }}
          >
            { socialNetworks.map((item, index) => (
              <HStack key={ index } spacing={ 2 } cursor="pointer">
                { /* Add your CustomIcon component here */ }
                <Link
                  href={ item.href }
                  isExternal
                  color={ textColor }
                  textTransform="capitalize"
                >
                  { item.name }
                </Link>
              </HStack>
            )) }
          </VStack>
        </GridItem>

        { /* Contact information */ }
        <GridItem colSpan={{ base: 1, lg: 3 }} ml={{ lg: -40 }}>
          <VStack alignItems="flex-start" spacing={ 7 } color={ textColor }>
            <HStack>
              { /* Add your CustomIcon component here */ }
              <Link href="mailto:contact@darenft.com">contact@darenft.com</Link>
            </HStack>
            <HStack>
              { /* Add your CustomIcon component here */ }
              <Link href="https://goo.gl/maps/L23U5rjxJa4wAFgu8" isExternal>
                66 Rangoon Road, 218356, Singapore
              </Link>
            </HStack>
            <HStack>
              { /* Add your CustomIcon component here */ }
              <Text>Monday – Friday, 8:00 am – 6:00 pm UTC +7</Text>
            </HStack>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Footer;
