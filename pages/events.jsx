import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { Sidebar } from "../components/Sidebar"
import firebase from "../firebase"
import { useUser } from "../utils/auth/useUser"

const Events = () => {
  const { user, loading } = useUser()
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const [events, setEvents] = React.useState([])
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
          let val = v.val()
          if (val.event) {
            n.push({ ...val, id: v.key })
          }
        })
        setEvents(n.reverse())
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
          Company Events
        </Heading>
        {events.map((v) => (
          <React.Fragment key={v.title}>
            <Flex alignItems="center" justifyContent="space-around" p="1rem">
              <Box key={v} m="0.5rem" p="1rem" flex={2}>
                <Heading size="md">{v.title}</Heading>
                <Text my=".5rem">{v.content}</Text>
                <AvatarGroup size="md" max={5}>
                  {v?.attendees &&
                    Object.keys(v.attendees)
                      .map((k) => v.attendees[k].user)
                      .map((u) => (
                        <Avatar size="md" src={u.avatar} key={v.title + u.id} />
                      ))}
                </AvatarGroup>
              </Box>
            </Flex>
            <Divider />
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  )
}

export default Events
