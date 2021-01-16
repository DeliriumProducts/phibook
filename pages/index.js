import { Button, Flex, Spinner, useColorModeValue } from "@chakra-ui/react"
import axios from "axios"
import { useRouter } from "next/router"
import { BiUserCircle } from "react-icons/bi"
import useSWR from "swr"
import { useUser } from "../utils/auth/useUser"

const fetcher = (url, token) =>
  axios
    .get(url, {
      headers: { "Content-Type": "application/json", token },
      credentials: "same-origin",
    })
    .then((res) => res.data)

const Index = () => {
  const { user, logout, loading } = useUser()
  const { data, error } = useSWR(
    user ? ["/api/getFood", user.token] : null,
    fetcher
  )
  const router = useRouter()
  const sideBarBg = useColorModeValue("gray.100", "gray.800")

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
          {user.firstName} {user.lastName}
        </Button>
      </Flex>
      <Flex flex={3} minHeight="100%">
        h
      </Flex>
    </Flex>
  )
}

export default Index
