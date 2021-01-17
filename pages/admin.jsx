import { Divider, Flex, Heading, Spinner } from "@chakra-ui/react"
import React from "react"
import { Sidebar } from "../components/Sidebar"
import { useUser } from "../utils/auth/useUser"

export default function Admin() {
  const { user, loading } = useUser()

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
        flexDirection="column"
      >
        <Heading size="4xl" p="1rem">
          News
        </Heading>
        {<Divider />}
      </Flex>
    </Flex>
  )
}
