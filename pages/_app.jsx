import { ChakraProvider } from "@chakra-ui/react"
import "../firebase"
import Layout from "../layouts/Layout"
import theme from "../theme"

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
