import {
  Avatar,
  AvatarBadge,
  Button,
  Divider,
  Flex,
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
      <NextLink href="/my-profile">
        <Button
          size="lg"
          variant="ghost"
          leftIcon={<Avatar src={user?.avatar} size="sm" />}
        >
          {user?.firstName} {user?.lastName}
        </Button>
      </NextLink>
      <Divider />
      {users
        .filter((v) => v.id != user.id)
        .map((v) => (
          <>
            <Button
              key={v.id}
              size="lg"
              variant=""
              leftIcon={
                <Avatar src={v.avatar} size="sm">
                  <AvatarBadge
                    boxSize="1.25em"
                    bg={Math.random() > 0.5 ? "red.500" : "green.500"}
                  />
                </Avatar>
              }
            >
              {v.firstName} {v.lastName}
            </Button>
          </>
        ))}
    </Flex>
  )
}

export { Sidebar }
