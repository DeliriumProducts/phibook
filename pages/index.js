import { Flex, Spinner } from "@chakra-ui/react"
import axios from "axios"
import { useRouter } from "next/router"
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

  if (loading || (!user && !loading)) {
    return <Spinner />
  }

  if (!user && !loading) {
    router.push("/auth")
  }

  return (
    <Flex w="100%" minHeight="100%" flexGrow={1}>
      <Flex flex={1} bg="red.50" minHeight="100%">
        h
      </Flex>
      <Flex flex={2} bg="green.50" minHeight="100%">
        h
      </Flex>
    </Flex>
  )
}

export default Index
