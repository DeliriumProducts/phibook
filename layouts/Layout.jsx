import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import {
  Box,
  Flex,
  Heading,
  IconButton,
  LinkBox,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { transparentize } from "@chakra-ui/theme-tools"
import styled from "@emotion/styled"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { BiLogOut } from "react-icons/bi"
import { BsFillChatFill, BsFillPeopleFill, BsNewspaper } from "react-icons/bs"
import { useUser } from "../utils/auth/useUser"

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
  const { logout } = useUser()
  const router = useRouter()

  return (
    <Flex
      flexDir="column"
      bg={bg}
      minH="100vh"
      transition="background-color 0.2s"
    >
      <StickyNav
        flexDir={{ base: "column", md: "row" }}
        bg={navBgColor}
        position={{ sm: "static", md: "sticky" }}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        px="1rem"
        as="nav"
        mx="auto"
      >
        <Flex>
          <NextLink href="/" passHref>
            <LinkBox
              justifyContent="space-between"
              href="/"
              display="flex"
              alignItems="center"
              flex={1}
            >
              <Heading>Φ</Heading>
            </LinkBox>
          </NextLink>
        </Flex>
        <Flex>
          <Tooltip label="News" fontSize="md">
            <NextLink href="/">
              <IconButton
                size="md"
                icon={<BsNewspaper />}
                mr={2}
                as="a"
                variant={router.pathname === "/" ? "solid" : "ghost"}
              />
            </NextLink>
          </Tooltip>
          <Tooltip label="Job Positions" fontSize="md">
            <NextLink href="/positions">
              <IconButton
                icon={<BsFillPeopleFill />}
                mr={2}
                as="a"
                variant={router.pathname === "/positions" ? "solid" : "ghost"}
              />
            </NextLink>
          </Tooltip>
          <Tooltip label="Chat" fontSize="md">
            <NextLink href="/chat">
              <IconButton
                icon={<BsFillChatFill />}
                as="a"
                variant={router.pathname === "/chat" ? "solid" : "ghost"}
              />
            </NextLink>
          </Tooltip>
        </Flex>
        <IconButton
          variant="ghost"
          onClick={logout}
          icon={<Box as={BiLogOut} boxSize="1rem" />}
        ></IconButton>
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
