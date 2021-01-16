import firebase from "firebase/app"
import "firebase/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { mapUserData } from "./mapUserData"
import {
  getUserFromCookie,
  removeUserCookie,
  setUserCookie,
} from "./userCookies"

const useUser = () => {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        setLoading(true)
        setUser()
        router.push("/auth")
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = firebase
      .auth()
      .onIdTokenChanged(async (user) => {
        if (user) {
          const userData = await mapUserData(user)
          setUserCookie(userData)
          setUser(userData)
          setLoading(false)
        } else {
          removeUserCookie()
          setUser()
          setLoading(false)
        }
      })

    const userFromCookie = getUserFromCookie()
    if (!userFromCookie) {
      router.push("/auth")
      return
    }
    setUser(userFromCookie)

    return () => {
      cancelAuthListener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { user, logout, loading }
}

export { useUser }
