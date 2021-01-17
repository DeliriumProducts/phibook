import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";`,
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";`,
  },
  styles: {
    global: (props) => ({
      "body, html, #__next": {
        minHeight: "100vh",
      },
    }),
  },
})

export default theme
