import firebase from "firebase/app"
import "firebase/auth"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import initFirebase from "../utils/auth/initFirebase"
import { mapUserData } from "../utils/auth/mapUserData"
import { setUserCookie } from "../utils/auth/userCookies"

// Init the Firebase app.
initFirebase()

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

const FirebaseAuth = () => {
  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={firebaseAuthConfig}
        firebaseAuth={firebase.auth()}
      />
    </div>
  )
}

export default FirebaseAuth
