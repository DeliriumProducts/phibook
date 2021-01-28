import {
  Avatar,
  Box,
  Checkbox,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { AiFillHeart } from "react-icons/ai"
import firebase from "../firebase"
import { useUser } from "../utils/auth/useUser"

const Colleagues = () => {
  const { user, loading } = useUser()
  const [users, setUsers] = React.useState([])
  const bg = useColorModeValue("white", "gray.800")
  const [filter, setFilter] = React.useState("")
  const toast = useToast()

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
      <Box>
        <FormLabel mt="2rem">Search for colleagues</FormLabel>
        <Input
         variant="filled"
         placeholder="George Ivanov, IT, 0899, etc..."
         w={["100%", "30rem"]}
         bg={bg}
         value={filter}
         onChange={(e) => setFilter(e.currentTarget.value)}
        />
      </Box>
      <Flex w="100%" minHeight="100%" flexGrow={1} flexDir="row" mt="5rem" flexWrap="wrap" justifyContent="center" alignItems="center">
        <Flex flexDir="row" flexWrap="wrap" justifyContent="center" alignItems="center">
          {users.map((wholeUser) => {
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
              admin: isAdmin,
            } = wholeUser

            if (wholeUser.id == user?.id) {
              return null
            }

            if (
              !JSON.stringify(wholeUser)
                .toLowerCase()
                .includes(filter.toLocaleLowerCase())
            ) {
              return null
            }

            return (
              <Flex
                key={wholeUser.id}
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
                <Flex alignItems="center" mt="1rem">
                  <IconButton
                    icon={<AiFillHeart />}
                    onClick={() => {
                      toast({
                        title: `You sent a thank you message to ${firstName}!`,
                        status: "success",
                      })
                    }}
                  />
                  {user?.admin && (
                    <Checkbox
                      ml="1rem"
                      colorScheme="purple"
                      isChecked={isAdmin}
                      onChange={(e) => {
                        firebase
                          .database()
                          .ref(`users/${wholeUser.id}`)
                          .update({ admin: e.currentTarget.checked })
                      }}
                    >
                      Admin?
                    </Checkbox>
                  )}
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
