import {
  Box,
  Flex,
  Heading,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { Sidebar } from "../components/Sidebar"
import { useUser } from "../utils/auth/useUser"

const Positions = () => {
  const sideBarBg = useColorModeValue("white", "gray.800")
  const { user, loading } = useUser()

  const router = useRouter()

  if (loading || (!user && !loading)) {
    return (
      <Flex
        w="100%"
        minHeight="100%"
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
      >
        <Spinner />
      </Flex>
    )
  }

  if (!user && !loading) {
    router.push("/auth")
  }

  return (
    <Flex w="100%" minHeight="100%" flexGrow={1}>
      <Sidebar user={user} />
      <Flex flex={3} minHeight="100%" flexDirection="column">
        <Heading size="3xl" p="1rem" position="sticky">
          Positions
        </Heading>
        {[...Array(1000).keys()].map((v) => (
          <Box w="5rem" h="5rem" bg="pink.50" key={v} m="1rem">
            {v}
          </Box>
        ))}
      </Flex>
    </Flex>
  )
}

export default Positions
