import { Avatar, Button, Flex, useColorModeValue } from "@chakra-ui/react"
import NextLink from "next/link"

const Sidebar = ({ user }) => {
  const sideBarBg = useColorModeValue("white", "gray.800")

  return (
    <Flex
      minHeight="100%"
      bg={sideBarBg}
      p="1rem"
      display={{ base: "none", md: "flex" }}
    >
      <NextLink href="/my-profile">
        <Button
          size="lg"
          variant="ghost"
          leftIcon={<Avatar src={user?.avatar} size="sm" />}
        >
          {user?.firstName} {user?.lastName}
        </Button>
      </NextLink>
    </Flex>
  )
}

export { Sidebar }
