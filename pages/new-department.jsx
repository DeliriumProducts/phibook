import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
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
  const [department, setDepartment] = React.useState("")

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

  const onSubmit = ({ depName }) => {
    const data = {
      name: depName,
    }

    setFormLoading(true)
    firebase
      .database()
      .ref("departments/")
      .push(data)
      .then(() => {
        toast({
          title: "Successfuly added a new department!",
          status: "success",
        })

        reset()
        setDepartment(null)
      })
      .catch((err) => {
        toast({
          title: err.toString(),
          status: "error",
        })

        reset()
        setDepartment(null)
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
            <FormControl isInvalid={errors.depName}>
              <FormLabel>Department name</FormLabel>
              <Input
                mb={5}
                name="depName"
                rounded={13}
                onChange={(e) => setDepartment(e.currentTarget.value)}
                ref={register({ required: true })}
                placeholder="Department name"
              />
              <FormErrorMessage>
                {errors.depName && "Name is required"}
              </FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              my={2}
              isLoading={loading}
              w="100%"
              size="lg"
              rounded={13}
              padding="10px"
              loading={formLoading}
            >
              Submit
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
