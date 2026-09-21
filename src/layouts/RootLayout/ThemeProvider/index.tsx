import { ThemeProvider as _ThemeProvider } from "@emotion/react"
import { createTheme } from "src/styles"
import type { Scheme } from "src/styles/theme"
import { Global } from "./Global"

type Props = {
  scheme: Scheme
  children?: React.ReactNode
}

export const ThemeProvider = ({ scheme, children }: Props) => {
  const theme = createTheme({
    scheme,
  })

  return (
    <_ThemeProvider theme={theme}>
      <Global />
      {children}
    </_ThemeProvider>
  )
}
