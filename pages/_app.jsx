import { ChakraProvider } from "@chakra-ui/react"
import Layout from "../layouts/Layout"
import theme from "../theme"
import initFirebase from "../utils/auth/initFirebase"

// Init the Firebase app.
initFirebase()

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default App
