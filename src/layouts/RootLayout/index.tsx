import styled from "@emotion/styled"
import type { ReactNode } from "react"
import { CONFIG } from "site.config"
import useScheme, { SchemeProvider } from "src/hooks/useScheme"
import Scripts from "src/layouts/RootLayout/Scripts"
import Header from "./Header"
import { ThemeProvider } from "./ThemeProvider"
import useGtagEffect from "./useGtagEffect"

type Props = {
  children: ReactNode
}

const RootLayoutContent = ({ children }: Props) => {
  const [scheme] = useScheme()
  useGtagEffect()
  return (
    <ThemeProvider scheme={scheme}>
      {CONFIG.isProd && <Scripts />}
      <Header fullWidth={false} />
      <StyledMain>{children}</StyledMain>
    </ThemeProvider>
  )
}

const RootLayout = ({ children }: Props) => (
  <SchemeProvider>
    <RootLayoutContent>{children}</RootLayoutContent>
  </SchemeProvider>
)

export default RootLayout

const StyledMain = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1120px;
  padding: 0 1rem;
`
