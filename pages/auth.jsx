import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import "firebase/auth"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { AiOutlineRight } from "react-icons/ai"
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
  const toast = useToast()
  const [loading, setLoading] = React.useState(false)
  const { register, handleSubmit, errors, reset } = useForm()
  const bg = useColorModeValue("transparent", "transparent")
  const onSubmit = (values) => {
    setLoading(true)
    firebase
      .auth()
      .signInWithEmailAndPassword(values["email"], values["pass"])
      .then(() => router.push("/"))
      .catch((err) => {
        toast({
          title: err.toString(),
          status: "error",
        })
      })
      .finally(() => setLoading(false))
  }

  return (
    <Flex
      as="form"
      w={["100%", "30rem"]}
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
          rounded={13}
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
          rounded={13}
        />
        <FormErrorMessage>
          {errors.pass && "password is required"}
        </FormErrorMessage>
      </FormControl>
      <Button
        rightIcon={<AiOutlineRight />}
        type="submit"
        my={2}
        isLoading={loading}
        bg={bg}
        w="100%"
        size="lg"
        rounded="lg"
        padding="10px"
      >
        Login
      </Button>
    </Flex>
  )
}

const RegisterForm = () => {
  const router = useRouter()
  const { register, handleSubmit, errors, reset } = useForm()
  const [departments, setDepartments] = React.useState([])
  const toast = useToast()
  const [loading, setLoading] = React.useState(false)
  const bg = useColorModeValue("transparent", "transparent")
  const onSubmit = (values) => {
    setLoading(true)
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.pass)
      .then((data) => {
        const { pass, ...valuesWith } = values
        firebase.database().ref(`users/${data.user.uid}`).set(valuesWith)
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

  React.useEffect(() => {
    return firebase
      .database()
      .ref("departments")
      .on("value", (snapshot) => {
        if (!snapshot) {
          return
        }
        const n = []
        snapshot.forEach((v) => {
          n.push({ ...v.val(), id: v.key })
        })
        setDepartments(n)
      })
  }, [])

  return (
    <Flex
      as="form"
      w={["100%", "30rem"]}
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
      <FormControl isInvalid={errors.middleName}>
        <Input
          ref={register({ required: true })}
          placeholder="middle name"
          name="middleName"
          size="lg"
          w="100%"
          my={2}
          padding="10px"
          variant="filled"
          bg={bg}
          rounded="lg"
        />
        <FormErrorMessage>
          {errors.middleName && "middle name is required"}
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
      <FormControl isInvalid={errors.department}>
        <Select
          placeholder="Select department"
          ref={register({ required: true })}
          name="department"
        >
          {departments.map((v) => (
            <option key={v.id} value={v.name}>
              {v.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>
          {errors.department && "department is required"}
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
        rightIcon={<AiOutlineRight />}
        type="submit"
        bg={bg}
        my={2}
        w="100%"
        size="lg"
        isLoading={loading}
        rounded="lg"
        padding="10px"
      >
        Register
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
