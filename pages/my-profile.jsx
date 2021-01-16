import { Avatar, Box, Flex, Heading, useColorModeValue } from "@chakra-ui/react"
import { useUser } from "../utils/auth/useUser"

const Page = () => {
  const { user, logout, loading } = useUser()
  const bg = useColorModeValue("white", "gray.800")

  return (
    <Flex
      w="100%"
      minHeight="100%"
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        bg={bg}
        minH="20rem"
        minW="20rem"
        flexDir="column"
        p="1rem"
        borderRadius="lg"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar size="2xl" marginTop="-17rem" />
        <Box>
          <Heading>{user?.firstName}</Heading>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Page
