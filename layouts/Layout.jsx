import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import {
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"

const Layout = ({ children }) => {
  const bg = useColorModeValue("gray.50", "gray.900")
  const { toggleColorMode } = useColorMode()
  const icon = useColorModeValue(<MoonIcon />, <SunIcon />)

  return (
    <>
      <Flex minHeight="100vh" bg={bg} align="center" justify="center">
        {children}
      </Flex>
      <IconButton
        aria-label="Toggle dark mode"
        position="fixed"
        left={5}
        bottom={5}
        icon={icon}
        onClick={toggleColorMode}
      />
    </>
  )
}

export default Layout
