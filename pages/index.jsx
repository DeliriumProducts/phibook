import {
  Avatar,
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react"
import axios from "axios"
import { useRouter } from "next/router"
import { BsTrash } from "react-icons/bs"
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
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const toast = useToast()

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
          n.push({ ...v.val(), id: v.key })
        })
        setNews(n.reverse())
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
      <Flex
        flex={3}
        p="2rem"
        minHeight="100%"
        flexDirection="column"
        ml={{ sm: 0, md: 64 }}
      >
        <Heading size="4xl" p="1rem">
          News
        </Heading>
        {/* <Flex align="center" justify="center" w="60%"> */}
        {news.map((v) => (
          <React.Fragment key={v.title}>
            <Flex alignItems="center" justifyContent="space-around" p="1rem">
              <Box key={v} m="0.5rem" p="1rem" flex={2}>
                <Heading size="md">{v.title}</Heading>
                <Text mt=".5rem">{v.content}</Text>
                <Flex mt="1rem" flexDirection="row" alignItems="center">
                  <Avatar size="md" src={v.publisherAvatar} />
                  <Text ml="1rem">{`${v?.publisher}`}</Text>
                </Flex>
              </Box>
              {user?.admin && (
                <IconButton
                  icon={<BsTrash />}
                  colorScheme="red"
                  isLoading={isLoading}
                  onClick={async () => {
                    setIsLoading(true)
                    await firebase.database().ref(`news/${v.id}`).remove()
                    setIsLoading(false)
                    toast({
                      title: "Successfully deleted article!",
                      status: "success",
                    })
                  }}
                  rounded="xl"
                  mr="1.5rem"
                />
              )}
            </Flex>
            <Divider />
          </React.Fragment>
        ))}
        {/* </Flex> */}
      </Flex>
    </Flex>
  )
}

export default Index
