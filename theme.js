import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  styles: {
    global: (props) => ({
      "body, html, #__next": {
        minWidth: "100vw",
        maxWidth: "100vw",
        width: "100vw",
        minHeight: "100vh",
      },
    }),
  },
})

export default theme
