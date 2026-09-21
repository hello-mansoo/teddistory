import type { ReactNode } from "react"
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type Scheme = "light" | "dark"
type SetScheme = (scheme: Scheme) => void
type SchemeContextValue = [Scheme, SetScheme]

const SchemeContext = createContext<SchemeContextValue | null>(null)

export const SchemeProvider = ({ children }: { children: ReactNode }) => {
  const [scheme, setSchemeState] = useState<Scheme>("dark")

  const setScheme = useCallback((nextScheme: Scheme) => {
    setSchemeState(nextScheme)
    // biome-ignore lint/suspicious/noDocumentCookie: synchronous fallback keeps theme persistence compatible across browsers
    document.cookie = `scheme=${nextScheme}; Path=/; Max-Age=31536000; SameSite=Lax`
  }, [])

  useEffect(() => {
    const savedScheme = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("scheme="))
      ?.split("=")[1]

    setSchemeState(
      savedScheme === "light" || savedScheme === "dark"
        ? savedScheme
        : getPreferredColorScheme()
    )
  }, [])

  const value = useMemo<SchemeContextValue>(
    () => [scheme, setScheme],
    [scheme, setScheme]
  )

  return createElement(SchemeContext.Provider, { value }, children)
}

const useScheme = (): [Scheme, SetScheme] => {
  const context = useContext(SchemeContext)
  if (!context) {
    throw new Error("useScheme must be used within SchemeProvider")
  }
  return context
}

export default useScheme

function getPreferredColorScheme(): Scheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}
