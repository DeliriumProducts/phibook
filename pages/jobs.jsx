import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spinner,
  Tag,
  Text,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { Sidebar } from "../components/Sidebar"
import firebase from "../firebase"
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
      <Flex
        flex={3}
        minHeight="100%"
        flexDirection="column"
        ml={{ sm: 0, md: 64 }}
      >
        <Heading size="3xl" p="1rem" position="sticky">
          Jobs
        </Heading>
        <Divider />
        {jobs.map((v) => (
          <>
            <Flex
              key={v.title}
              alignItems="center"
              justifyContent="space-between"
              p="1rem"
              flexWrap="wrap"
            >
              <Box key={v} p="1rem">
                <Heading size="lg" mb=".5rem">
                  {v.title}
                </Heading>
                <Tag colorScheme="green" mb=".5rem">
                  {v.salary}
                </Tag>
                {v.remote ? (
                  <Tag colorScheme="purple" mb=".5rem" ml={2}>
                    Remote
                  </Tag>
                ) : (
                  <Tag colorScheme="yellow" mb=".5rem" ml={2}>
                    Local
                  </Tag>
                )}
                {v.flexibleHours && (
                  <Tag colorScheme="blue" mb=".5rem" ml={2}>
                    Flexible hours
                  </Tag>
                )}
                <Text>{v.content}</Text>
              </Box>
              <Button size="lg" w={["100%", "6rem"]}>
                Apply
              </Button>
            </Flex>
            <Divider />
          </>
        ))}
      </Flex>
    </Flex>
  )
}

export default Positions
