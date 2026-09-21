import styled from "@emotion/styled"
import { Emoji } from "src/components/Emoji"
import useScheme from "src/hooks/useScheme"

const ThemeToggle = () => {
  const [scheme, setScheme] = useScheme()

  const handleClick = () => {
    setScheme(scheme === "light" ? "dark" : "light")
  }

  return (
    <StyledWrapper
      type="button"
      aria-label={`${scheme === "light" ? "Dark" : "Light"} theme`}
      onClick={handleClick}
    >
      <Emoji>{scheme === "light" ? "☀️" : "🌙"}</Emoji>
    </StyledWrapper>
  )
}

export default ThemeToggle

const StyledWrapper = styled.button`
  cursor: pointer;
`
