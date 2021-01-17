import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spinner,
  Tag,
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
  const [title, setTitle] = React.useState("")
  const [salary, setSalary] = React.useState(0)
  const [body, setBody] = React.useState("")
  const [isRemote, setIsRemote] = React.useState(true)
  const [isFlexible, setIsFlexible] = React.useState(true)

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

  const onSubmit = ({ jobBody, jobSalary, jobTitle, flexible, remote }) => {
    const data = {
      title: jobTitle,
      flexibleHours: flexible,
      remote: remote,
      content: jobBody,
      salary: `$${jobSalary}`,
    }

    setFormLoading(true)
    firebase
      .database()
      .ref("jobs/")
      .push(data)
      .then(() => {
        toast({
          title: "Successfuly added a new job!",
          status: "success",
        })

        reset()
        setTitle(null)
        setBody(null)
        setSalary(0)
      })
      .catch((err) => {
        toast({
          title: err.toString(),
          status: "error",
        })

        reset()
        setTitle(null)
        setBody(null)
        setSalary(0)
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
          Job
        </Heading>
        <Flex height="100%" align="center" justify="center">
          <Box as="form" w="50%" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.jobTitle}>
              <FormLabel>Title</FormLabel>
              <Input
                mb={5}
                name="jobTitle"
                rounded={13}
                onChange={(e) => setTitle(e.currentTarget.value)}
                ref={register({ required: true })}
                placeholder="Your job title"
              />
              <FormErrorMessage>
                {errors.jobTitle && "Title is required"}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.jobSalary}>
              <FormLabel>Salary (in USD.)</FormLabel>
              <Input
                name="jobSalary"
                type="number"
                onChange={(e) => {
                  setSalary(Number(e.currentTarget.value))
                }}
                mb={5}
                placeholder="Job salary"
                ref={register({ required: true, valueAsNumber: true })}
              ></Input>
              <FormErrorMessage>
                {errors.jobSalary && "Salary is required"}
              </FormErrorMessage>
            </FormControl>
            <HStack spacing={10} direction="row">
              <Checkbox
                size="lg"
                name="remote"
                colorScheme="purple"
                onChange={(e) => {
                  setIsRemote(e.currentTarget.checked)
                }}
                ref={register}
                defaultIsChecked
              >
                This job is remote
              </Checkbox>
              <Checkbox
                size="lg"
                name="flexible"
                onChange={(e) => {
                  setIsFlexible(!!e.currentTarget.checked)
                }}
                colorScheme="blue"
                ref={register}
                defaultIsChecked
              >
                It offers flexible hours
              </Checkbox>
            </HStack>
            <FormControl isInvalid={errors.jobBody}>
              <FormLabel>Body</FormLabel>
              <Textarea
                name="jobBody"
                rounded={13}
                onChange={(e) => setBody(e.currentTarget.value)}
                ref={register({ required: true })}
                placeholder="Your job body"
              />
              <FormErrorMessage>
                {errors.jobBody && "Body is required"}
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
        <Heading size="lg" p="1rem">
          Preview
        </Heading>
        {title === "" && body === "" && salary === 0 ? (
          <></>
        ) : (
          <React.Fragment>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              p="1rem"
              flexWrap="wrap"
            >
              <Box p="1rem">
                <Heading size="lg" mb=".5rem">
                  {title}
                </Heading>
                <Tag colorScheme="green" mb=".5rem">
                  {`$${salary}`}
                </Tag>
                {isRemote ? (
                  <Tag colorScheme="purple" mb=".5rem" ml={2}>
                    Remote
                  </Tag>
                ) : (
                  <Tag colorScheme="yellow" mb=".5rem" ml={2}>
                    Local
                  </Tag>
                )}
                {isFlexible && (
                  <Tag colorScheme="blue" mb=".5rem" ml={2}>
                    Flexible hours
                  </Tag>
                )}
                <Text>{body}</Text>
              </Box>
            </Flex>
            <Divider />
          </React.Fragment>
        )}
      </Flex>
    </Flex>
  )
}
