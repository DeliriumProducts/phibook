import { Spinner } from "@chakra-ui/react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import useSWR from "swr"
import { useUser } from "../utils/auth/useUser"

const fetcher = (url, token) =>
  axios
    .get(url, {
      headers: { "Content-Type": "application/json", token },
      credentials: "same-origin",
    })
    .then((res) => res.data)

const Index = () => {
  const { user, logout, loading } = useUser()
  const { data, error } = useSWR(
    user ? ["/api/getFood", user.token] : null,
    fetcher
  )
  const router = useRouter()

  React.useEffect(() => {
    if (!user && !loading) {
      router.push("/auth")
    }
  }, [user, loading])

  if (loading || (!user && !loading)) {
    return <Spinner />
  }

  return (
    <div>
      <div>
        <p>You're signed in. Email: {user.email}</p>
        <p
          style={{
            display: "inline-block",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => logout()}
        >
          Log out
        </p>
      </div>
      <div>
        <Link href={"/example"}>
          <a>Another example page</a>
        </Link>
      </div>
      {error && <div>Failed to fetch food!</div>}
      {data && !error ? (
        <div>Your favorite food is {data.food}.</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default Index
