import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import firebase from "../firebase"
import { useUser } from "../utils/auth/useUser"

const Colleagues = () => {
  const { user, loading } = useUser()
  const [users, setUsers] = React.useState([])
  const bg = useColorModeValue("white", "gray.800")
  const [filter, setFilter] = React.useState("")

  React.useEffect(() => {
    return firebase
      .database()
      .ref("users")
      .on("value", (snapshot) => {
        if (!snapshot) {
          return
        }
        const n = []
        snapshot.forEach((v) => {
          n.push({ ...v.val(), id: v.key })
        })
        setUsers(n)
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
    <Flex flexDir="column" justifyContent="center" alignItems="center">
      <FormLabel mt="2rem">Search for colleagues</FormLabel>
      <Input
        variant="filled"
        placeholder="George Ivanov, IT, 0899, etc..."
        w={["100%", "30rem"]}
        bg={bg}
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
      />
      <Flex w="100%" minHeight="100%" flexGrow={1} flexDir="column" mt="5rem">
        <Flex flexDir="column" justifyContent="center" alignItems="center">
          {users.map((user) => {
            const {
              firstName,
              lastName,
              middleName,
              email,
              phone,
              workPosition: job,
              bio,
              avatar,
              department,
            } = user

            if (
              !JSON.stringify(user)
                .toLowerCase()
                .includes(filter.toLocaleLowerCase())
            ) {
              return null
            }

            return (
              <Flex
                key={user.id}
                bg={bg}
                m="2rem"
                mb="2.5rem"
                flexDir="column"
                w={["100%", "30rem"]}
                p="4rem"
                borderRadius="lg"
                justifyContent="center"
                alignItems="center"
              >
                <Box>
                  <Avatar size="2xl" marginTop="-8rem" src={avatar} />
                </Box>
                <Flex justifyContent="center" flexDirection="column">
                  <Heading textAlign="center">
                    {firstName} {middleName} {lastName}
                  </Heading>
                  <Heading mt="1rem" size="md">
                    Job
                  </Heading>
                  <Text fontStyle="italic" mt=".5rem">
                    {job}
                  </Text>
                  <Heading mt="1rem" size="md">
                    Bio
                  </Heading>
                  <Text fontStyle="italic" mt=".5rem">
                    {bio}
                  </Text>
                  <Heading mt="1rem" size="md">
                    Phone
                  </Heading>
                  <Text fontStyle="italic" mt=".5rem">
                    {phone}
                  </Text>
                  <Heading mt="1rem" size="md">
                    Department
                  </Heading>
                  <Text fontStyle="italic" mt=".5rem">
                    {department}
                  </Text>
                  <Heading mt="1rem" size="md">
                    Email
                  </Heading>
                  <Text fontStyle="italic" mt=".5rem">
                    {email}
                  </Text>
                </Flex>
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Colleagues
