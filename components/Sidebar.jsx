import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import firebase from "firebase"
import NextLink from "next/link"

const Sidebar = ({ user }) => {
  const sideBarBg = useColorModeValue("white", "gray.800")

  const [users, setUsers] = React.useState([])

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

  return (
    <Flex
      bg={sideBarBg}
      position="fixed"
      p="1rem"
      w={64}
      height="100%"
      flexDirection="column"
      display={{ base: "none", md: "flex" }}
    >
      <Heading size="md" my="1rem">
        My Profile
      </Heading>
      <Divider mb="1rem" />
      <NextLink href="/my-profile">
        <Button
          size="lg"
          variant="ghost"
          leftIcon={<Avatar src={user?.avatar} size="sm" />}
        >
          {user?.firstName} {user?.lastName}
        </Button>
      </NextLink>
      <Heading size="md" my="1rem">
        Colleagues
      </Heading>
      <Divider mb="1rem" />
      {users
        .filter((v) => v.id != user.id)
        .map((v) => (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            my="0.5rem"
            key={v.id}
          >
            <Text as="span">
              {v.firstName} {v.lastName}
            </Text>
            <Box mr="12px">
              <Avatar src={v.avatar} size="sm">
                <AvatarBadge
                  boxSize="1.25em"
                  bg={Math.random() > 0.5 ? "red.500" : "green.500"}
                />
              </Avatar>
            </Box>
          </Flex>
        ))}
    </Flex>
  )
}

export { Sidebar }
