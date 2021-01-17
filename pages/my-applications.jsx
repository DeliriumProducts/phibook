import {
  Box,
  Divider,
  Flex,
  Heading,
  Spinner,
  Tag,
  Text,
} from "@chakra-ui/react"
import "firebase/auth"
import { useRouter } from "next/router"
import React from "react"
import { Sidebar } from "../components/Sidebar"
import { useUser } from "../utils/auth/useUser"

export default function Admin() {
  const { user, loading } = useUser()
  const router = useRouter()

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
    <Flex w="100%" minHeight="100%" flexGrow={1}>
      <Sidebar user={user} />
      <Flex
        ml={{ sm: 0, md: 64 }}
        flex={3}
        minHeight="100%"
        p="2rem"
        w="100%"
        flexDirection="column"
      >
        <Heading size="4xl" p="1rem">
          Applications
        </Heading>
        {!user.applications ? (
          <Heading size="xl" p="1rem">
            You haven't applied for any jobs yet!
          </Heading>
        ) : (
          Object.keys(user?.applications).map((v) => (
            <React.Fragment key={user?.applications[v].title}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                p="1rem"
                flexWrap="wrap"
              >
                <Box key={v} p="1rem">
                  <Heading size="lg" mb=".5rem">
                    {user?.applications[v].title}
                  </Heading>
                  <Tag colorScheme="green" mb=".5rem">
                    {user?.applications[v].salary}
                  </Tag>
                  {user?.applications[v].remote ? (
                    <Tag colorScheme="purple" mb=".5rem" ml={2}>
                      Remote
                    </Tag>
                  ) : (
                    <Tag colorScheme="yellow" mb=".5rem" ml={2}>
                      Local
                    </Tag>
                  )}
                  {user?.applications[v].flexibleHours && (
                    <Tag colorScheme="blue" mb=".5rem" ml={2}>
                      Flexible hours
                    </Tag>
                  )}
                  <Text>{user?.applications[v].content}</Text>
                </Box>
              </Flex>
              <Divider />
            </React.Fragment>
          ))
        )}
      </Flex>
    </Flex>
  )
}
