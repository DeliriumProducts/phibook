import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import "firebase/auth"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { BiLogIn } from "react-icons/bi"
import firebase from "../firebase"
import { mapUserData } from "../utils/auth/mapUserData"
import { setUserCookie } from "../utils/auth/userCookies"
import { useUser } from "../utils/auth/useUser"

const firebaseAuthConfig = {
  signInFlow: "popup",
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  signInSuccessUrl: "/",
  credentialHelper: "none",
  callbacks: {
    signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
      const userData = await mapUserData(user)
      setUserCookie(userData)
    },
  },
}

const LoginForm = () => {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const { register, handleSubmit, errors, reset } = useForm({
    reValidateMode: "onBlur",
  })
  const bg = useColorModeValue("gray.200", "gray.800")
  const onSubmit = (values) => {
    setLoading(true)
    firebase
      .auth()
      .signInWithEmailAndPassword(values["email"], values["pass"])
      .then(() => router.push("/"))
      .catch((err) => {
        alert(err)
        reset()
      })
      .finally(() => setLoading(true))
  }

  return (
    <Flex
      as="form"
      w="100%"
      justify="center"
      align="center"
      flexDir="column"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl isInvalid={errors.email}>
        <Input
          ref={register({ required: true })}
          placeholder="email"
          name="email"
          size="lg"
          w="100%"
          my={2}
          padding="10px"
          variant="filled"
          bg={bg}
          rounded="lg"
        />
        <FormErrorMessage>
          {errors.email && "email is required"}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.pass}>
        <Input
          ref={register({ required: true })}
          placeholder="pass"
          type="password"
          name="pass"
          size="lg"
          w="100%"
          my={2}
          padding="10px"
          variant="filled"
          bg={bg}
          rounded="lg"
        />
        <FormErrorMessage>
          {errors.pass && "password is required"}
        </FormErrorMessage>
      </FormControl>
      <Button
        leftIcon={<BiLogIn />}
        type="submit"
        my={2}
        isLoading={loading}
        bg={bg}
        w="100%"
        size="lg"
        rounded="lg"
        padding="10px"
      >
        login
      </Button>
    </Flex>
  )
}

const RegisterForm = () => {
  const router = useRouter()
  const { register, handleSubmit, errors, reset } = useForm({
    reValidateMode: "onBlur",
  })
  const toast = useToast()
  const [loading, setLoading] = React.useState(false)
  const bg = useColorModeValue("gray.200", "gray.800")
  const onSubmit = (values) => {
    setLoading(true)
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.pass)
      .then((data) => {
        const { email, pass, ...valuesWithoutEmailAndPass } = values
        firebase
          .database()
          .ref(`users/${data.user.uid}`)
          .set(valuesWithoutEmailAndPass)
        router.push("/")
      })
      .catch((err) => {
        toast({
          title: err.toString(),
          status: "error",
        })
        reset()
      })
      .finally(() => setLoading(false))
  }

  return (
    <Flex
      as="form"
      w="100%"
      justify="center"
      align="center"
      flexDir="column"
      onSubmit={handleSubmit(onSubmit)}
    >
      <>
        <FormControl isInvalid={errors.email}>
          <Input
            ref={register({ required: true })}
            placeholder="email"
            name="email"
            size="lg"
            w="100%"
            my={2}
            padding="10px"
            variant="filled"
            bg={bg}
            rounded="lg"
          />
          <FormErrorMessage>
            {errors.email && "email is required"}
          </FormErrorMessage>
        </FormControl>
      </>

      <FormControl isInvalid={errors.firstName}>
        <Input
          ref={register({ required: true })}
          placeholder="first name"
          name="firstName"
          size="lg"
          w="100%"
          my={2}
          padding="10px"
          variant="filled"
          bg={bg}
          rounded="lg"
        />
        <FormErrorMessage>
          {errors.firstName && "first name is required"}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.lastName}>
        <Input
          ref={register({ required: true })}
          placeholder="last name"
          name="lastName"
          size="lg"
          w="100%"
          my={2}
          padding="10px"
          variant="filled"
          bg={bg}
          rounded="lg"
        />
        <FormErrorMessage>
          {errors.lastName && "last name is required"}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.pass}>
        <Input
          ref={register({ required: true })}
          placeholder="pass"
          type="password"
          name="pass"
          size="lg"
          w="100%"
          my={2}
          padding="10px"
          variant="filled"
          bg={bg}
          rounded="lg"
        />
        <FormErrorMessage>
          {errors.pass && "password is required"}
        </FormErrorMessage>
      </FormControl>
      <Button
        leftIcon={<BiLogIn />}
        type="submit"
        bg={bg}
        my={2}
        w="100%"
        size="lg"
        isLoading={loading}
        rounded="lg"
        padding="10px"
      >
        register
      </Button>
    </Flex>
  )
}

const FirebaseAuth = () => {
  const [isLogin, setFormType] = React.useState(true)
  const router = useRouter()
  const { user } = useUser()
  if (user) {
    router.push("/")
  }

  return (
    <Flex
      w="100%"
      minHeight="100%"
      flexGrow={1}
      justify="center"
      align="center"
      direction="column"
    >
      <Box marginY={2}>
        <Text fontSize="6xl" as="b">
          phibook.
        </Text>
      </Box>
      <Box>{isLogin ? <LoginForm /> : <RegisterForm />}</Box>
      <Button variant="ghost" size="xs" onClick={() => setFormType((v) => !v)}>
        {isLogin ? "don't have an account?" : "already have an account?"}
      </Button>
    </Flex>
  )
}

export default FirebaseAuth
