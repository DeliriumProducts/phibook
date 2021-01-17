import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spinner,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { Sidebar } from "../components/Sidebar"
import firebase from "../firebase"
import { useUser } from "../utils/auth/useUser"

const Positions = () => {
  const { user, loading } = useUser()
  const router = useRouter()
  const toast = useToast()
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
          n.push({ ...v.val(), id: v.key })
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
          <React.Fragment key={v.title}>
            <Flex
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
              <Button
                size="lg"
                disabled={
                  user?.applications &&
                  Object.keys(user?.applications)
                    .map((k) => user?.applications[k].id)
                    .includes(v.id)
                }
                w={["100%", "6rem"]}
                onClick={async () => {
                  await firebase
                    .database()
                    .ref(`users/${user.id}/applications`)
                    .push(v)
                  await firebase
                    .database()
                    .ref(`applications`)
                    .push({
                      ...v,
                      id: user.id,
                      email: user.email,
                      avatar: user.avatar,
                    })
                  toast({
                    title: "Successfully applied to job!",
                    status: "success",
                  })
                }}
              >
                Apply
              </Button>
            </Flex>
            <Divider />
          </React.Fragment>
        ))}
      </Flex>
    </Flex>
  )
}

export default Positions
