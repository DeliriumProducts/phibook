import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react"
import axios from "axios"
import { useRouter } from "next/router"
import { BiUserCircle } from "react-icons/bi"
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
  const { user, logout, loading } = useUser()

  const router = useRouter()
  const sideBarBg = useColorModeValue("white", "gray.800")

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
        setNews(news)
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
      <Flex
        flex={1}
        minHeight="100%"
        bg={sideBarBg}
        p=".3rem"
        display={{ base: "none", md: "flex" }}
      >
        <Button
          size="lg"
          variant="ghost"
          leftIcon={<BiUserCircle />}
          onClick={() => {
            firebase.database().ref("news").push({
              title: "We're moving to AWS",
              content: "After a long debate, we're moving to AWS.",
            })
          }}
        >
          {user.firstName} {user.lastName}
        </Button>
      </Flex>
      <Flex flex={3} minHeight="100%" flexDirection="column">
        <Heading size="3xl" p="1rem" position="sticky">
          News
        </Heading>
        {news.map((v) => (
          <Box w="5rem" key={v} m="1rem">
            <Heading>{v.title}</Heading>
            <Text>{v.content}</Text>
          </Box>
        ))}
      </Flex>
    </Flex>
  )
}

export default Index
