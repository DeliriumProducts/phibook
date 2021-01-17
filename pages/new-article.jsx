import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import "firebase/auth"
import { useRouter } from "next/router"
import React from "react"
import { useForm } from "react-hook-form"
import { Sidebar } from "../components/Sidebar"
import firebase from "../firebase"
import { useUser } from "../utils/auth/useUser"

export default function Admin() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [body, setBody] = React.useState("")
  const [isEvent, setIsEvent] = React.useState(false)
  const [formLoading, setFormLoading] = React.useState(false)
  const { register, handleSubmit, errors, reset } = useForm({
    reValidateMode: "onBlur",
  })
  const toast = useToast()

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

  if (!user.admin && !loading) {
    router.push("/")
  }

  const onSubmit = ({ arcTitle, arcBody, event }) => {
    const data = {
      title: arcTitle,
      publisher: user.firstName + " " + user.lastName,
      content: arcBody,
      event,
      publisherAvatar: user.avatar,
    }

    setFormLoading(true)
    firebase
      .database()
      .ref("news/")
      .push(data)
      .then(() => {
        toast({
          title: "Successfuly added a new article!",
          status: "success",
        })

        reset()
        setTitle(null)
        setBody(null)
      })
      .catch((err) => {
        toast({
          title: err.toString(),
          status: "error",
        })

        reset()
        setTitle(null)
        setBody(null)
      })
      .finally(() => setFormLoading(false))
  }

  return (
    <Flex w="100%" minHeight="100%" flexGrow={1}>
      <Sidebar user={user} />
      <Flex
        ml={{ sm: 0, md: 64 }}
        flex={3}
        minHeight="100%"
        w="100%"
        flexDirection="column"
      >
        <Heading size="4xl" p="1rem">
          Article
        </Heading>
        <Flex height="100%" align="center" justify="center">
          <Box as="form" w="50%" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.arcTitle}>
              <FormLabel>Title</FormLabel>
              <Input
                mb={5}
                name="arcTitle"
                rounded={13}
                onChange={(e) => setTitle(e.currentTarget.value)}
                ref={register({ required: true })}
                placeholder="Your article title"
              />
              <FormErrorMessage>
                {errors.arcTitle && "Title is required"}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.arcBody}>
              <FormLabel>Body</FormLabel>
              <Textarea
                name="arcBody"
                rounded={13}
                onChange={(e) => setBody(e.currentTarget.value)}
                ref={register({ required: true })}
                placeholder="Your article body"
              />
              <FormErrorMessage>
                {errors.arcBody && "Body is required"}
              </FormErrorMessage>
            </FormControl>
            <Checkbox
              my={5}
              size="lg"
              name="event"
              colorScheme="purple"
              onChange={(e) => {
                setIsEvent(e.currentTarget.checked)
              }}
              ref={register}
              defaultIsChecked
            >
              This is an event
            </Checkbox>
            <Button
              type="submit"
              my={2}
              w="100%"
              size="lg"
              rounded={13}
              padding="10px"
              isLoading={formLoading}
            >
              Submit
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
