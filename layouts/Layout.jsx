import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import {
  Box,
  Flex,
  Heading,
  IconButton,
  LinkBox,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { transparentize } from "@chakra-ui/theme-tools"
import styled from "@emotion/styled"
import NextLink from "next/link"

// https://github.com/leerob/leerob.io/blob/b061aac7bdedd51dd511adb751483ef47c18b0e6/components/Container.js#L8
const StickyNav = styled(Flex)`
  z-index: 10;
  top: 0;
  backdrop-filter: blur(1rem);
  padding-top: 0.65rem;
  padding-bottom: 0.65rem;
`

const Layout = ({ children }) => {
  const bg = useColorModeValue("gray.50", "gray.900")
  const navBgColor = useColorModeValue(
    transparentize("white", 0.8),
    transparentize("gray.800", 0.8)
  )
  const { toggleColorMode } = useColorMode()
  const icon = useColorModeValue(<MoonIcon />, <SunIcon />)

  return (
    <Flex
      flexDir="column"
      bg={bg}
      minH="100vh"
      transition="background-color 0.2s"
    >
      <StickyNav
        borderBottomWidth="1px"
        flexDir={{ base: "column", md: "row" }}
        bg={navBgColor}
        position={{ sm: "static", md: "sticky" }}
        justifyContent="space-around"
        alignItems="center"
        width="100%"
        as="nav"
        mx="auto"
      >
        <NextLink href="/" passHref>
          <LinkBox
            justifyContent="space-between"
            href="/"
            display="flex"
            alignItems="center"
            flex={1}
          >
            <Heading ml="1rem">Φ</Heading>
          </LinkBox>
        </NextLink>
        <Box flex={2} />
      </StickyNav>
      {children}
      <IconButton
        aria-label="Toggle dark mode"
        position="fixed"
        left={5}
        bottom={5}
        icon={icon}
        onClick={toggleColorMode}
      />
    </Flex>
  )
}

export default Layout
