import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import firebase from "firebase"
import { FaFacebook, FaGithub, FaTwitter } from "react-icons/fa"
import { useUser } from "../utils/auth/useUser"

const Page = () => {
  const { user, logout, loading } = useUser()
  const toast = useToast()
  const bg = useColorModeValue("white", "gray.800")
  const imageRef = React.useRef()
  const [url, setURL] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [job, setJob] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const onClick = async () => {
    setIsLoading(true)
    await Promise.all([
      firebase.database().ref(`users/${user?.id}`).update({
        bio: bio,
      }),
      firebase.database().ref(`users/${user?.id}`).update({
        phone: phone,
      }),
    ])
    setIsLoading(false)

    toast({
      title: "Successfully updated profile!",
      status: "success",
    })
  }

  React.useEffect(() => {
    setBio(user?.bio)
    setPhone(user?.phone)
    setJob(user?.workPosition)
  }, [user?.bio, user?.phone, user?.workPosition])

  const upload = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    const uploadTask = firebase
      .storage()
      .ref(`images/${user.id + file.name}`)
      .put(file)
    uploadTask.on("state_changed", console.log, console.error, () => {
      firebase
        .storage()
        .ref("images")
        .child(`${user.id + file.name}`)
        .getDownloadURL()
        .then((url) => {
          setURL(url)
          return firebase.database().ref(`users/${user.id}`).update({
            avatar: url,
          })
        })
    })
  }

  return (
    <Flex
      w="100%"
      minHeight="100%"
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      mt={"5rem"}
    >
      {loading ? (
        <Spinner />
      ) : (
        <Flex
          bg={bg}
          flexDir="column"
          p="4rem"
          borderRadius="lg"
          justifyContent="center"
          alignItems="center"
        >
          <Box>
            <Avatar
              size="2xl"
              marginTop="-8rem"
              src={url || user?.avatar}
              _hover={{
                opacity: 0.4,
                transition: "opacity ease-in-out 0.2s",
              }}
              onClick={() => {
                imageRef.current.click()
              }}
            />
          </Box>
          <Input
            type="file"
            ref={imageRef}
            style={{ display: "none" }}
            onChange={upload}
          />
          <Flex justifyContent="center" flexDirection="column">
            <Heading textAlign="center">
              {user?.firstName} {user?.lastName}
            </Heading>
            <Heading mt="1rem" size="md">
              Job
            </Heading>
            <Input
              variant="flushed"
              value={job}
              fontStyle="italic"
              mt=".5rem"
              onChange={(e) => setJob(e.currentTarget.value)}
            />
            <Heading mt="1rem" size="md">
              Bio
            </Heading>
            <Input
              variant="flushed"
              value={bio}
              fontStyle="italic"
              mt=".5rem"
              onChange={(e) => setBio(e.currentTarget.value)}
            />
            <Heading mt="1rem" size="md">
              Phone
            </Heading>
            <Input
              value={phone}
              fontStyle="italic"
              mt=".5rem"
              variant="flushed"
              onChange={(e) => setPhone(e.currentTarget.value)}
            />
            <Heading mt="1rem" size="md">
              Department
            </Heading>
            <Text fontStyle="italic" mt=".5rem">
              {user?.department}
            </Text>
            <Flex mt="1rem" justifyContent="space-evenly">
              <Box
                as={FaTwitter}
                opacity={user?.twitter ? "1" : "0.5"}
                _hover={{
                  opacity: 1,
                }}
                transition="opacity ease-in-out 0.2s"
                boxSize="3rem"
              />
              <Box
                as={FaGithub}
                opacity={user?.github ? "1" : "0.5"}
                _hover={{
                  opacity: 1,
                }}
                transition="opacity ease-in-out 0.2s"
                boxSize="3rem"
              />
              <Box
                as={FaFacebook}
                transition="opacity ease-in-out 0.2s"
                opacity={user?.facebook ? "1" : "0.5"}
                _hover={{
                  opacity: 1,
                }}
                boxSize="3rem"
              />
            </Flex>
            <Button mt="2rem" onClick={onClick} isLoading={isLoading}>
              Save
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

export default Page
