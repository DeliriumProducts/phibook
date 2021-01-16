import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { BiUserCircle } from "react-icons/bi"
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
      <Flex
        flex={1}
        minHeight="100%"
        bg={sideBarBg}
        p=".3rem"
        display={{ base: "none", md: "flex" }}
      >
        <Button size="lg" variant="ghost" leftIcon={<BiUserCircle />}>
          {user?.firstName} {user?.lastName}
        </Button>
      </Flex>
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
