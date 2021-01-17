import { Box, Divider, Flex, Heading, Spinner, Text } from "@chakra-ui/react"
import axios from "axios"
import { useRouter } from "next/router"
import { Sidebar } from "../components/Sidebar"
import firebase from "../firebase"
import { useUser } from "../utils/auth/useUser"

const fetcher = (url, token) =>
  axios
    .get(url, {
      headers: { "Content-Type": "application/json", token },
      credentials: "same-origin",
    })
    .then((res) => res.data)
//  const { data, error } = useSWR(
//     user ? ["/api/getFood", user.token] : null,
//     fetcher
//   )
const Index = () => {
  const { user, loading } = useUser()

  const router = useRouter()

  const [news, setNews] = React.useState([])
  React.useEffect(() => {
    return firebase
      .database()
      .ref("news")
      .on("value", (snapshot) => {
        if (!snapshot) {
          return
        }
        const n = []
        snapshot.forEach((v) => {
          n.push(v.val())
        })
        setNews(n)
      })
  }, [])

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
        <Heading size="4xl" p="1rem">
          News
        </Heading>
        {<Divider />}
        {news.map((v) => (
          <>
            <Box key={v} m="1rem" p="1rem">
              <Heading size="lg">{v.title}</Heading>
              <Text>{v.content}</Text>
            </Box>
            <Divider />
          </>
        ))}
      </Flex>
    </Flex>
  )
}

export default Index
