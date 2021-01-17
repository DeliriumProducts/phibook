import { Box, Flex, Heading, Spinner } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { Sidebar } from "../components/Sidebar"
import { useUser } from "../utils/auth/useUser"

const Positions = () => {
  const { user, loading } = useUser()

  const router = useRouter()

  const [jobs, setJobs] = React.useState([])
  React.useEffect(() => {
    return firebase
      .database()
      .ref("jobs")
      .on("value", (snapshot) => {
        if (!snapshot) {
          return
        }
        const n = []
        snapshot.forEach((v) => {
          n.push(v.val())
        })
        setJobs(n)
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
        <Heading size="3xl" p="1rem" position="sticky">
          Jobs
        </Heading>
        {jobs.map((v) => (
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

export default Positions
