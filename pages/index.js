import { Box, Heading, Spinner } from "@chakra-ui/react"
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
    <Box w="100%" minH="100vh">
      <Heading>Welcome, {user.firstName}</Heading>
    </Box>
  )
}

export default Index
