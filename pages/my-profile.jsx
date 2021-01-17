import {
  Avatar,
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import firebase from "firebase"
import { useUser } from "../utils/auth/useUser"

const Page = () => {
  const { user, logout, loading } = useUser()
  const bg = useColorModeValue("white", "gray.800")
  const imageRef = React.useRef()
  const [url, setURL] = React.useState("")

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
    >
      <Flex
        bg={bg}
        minH="20rem"
        minW="20rem"
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
        <input
          type="file"
          ref={imageRef}
          style={{ display: "none" }}
          onChange={upload}
        />
        <Flex justifyContent="center" flexDirection="column">
          <Heading textAlign="center">
            {user?.firstName} {user?.lastName}
          </Heading>
          {user?.bio && (
            <Text mt=".5rem" textAlign="center" fontStyle="italic">
              "{user?.bio}"
            </Text>
          )}
          <Heading mt="1rem" size="md">
            Job
          </Heading>
          <Text fontSize="sm">{user?.workPosition}</Text>
          <Heading mt="1rem" size="md">
            Phone
          </Heading>
          <Text fontSize="sm">{user?.phone}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Page
