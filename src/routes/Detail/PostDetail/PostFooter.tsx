import styled from "@emotion/styled"
import Link from "next/link"

const Footer = () => {
  return (
    <StyledWrapper>
      <Link href="/">← Back</Link>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑ Top
      </button>
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.gray10};
  a,
  button {
    padding: 0;
    border: 0;
    font: inherit;
    background: transparent;
    color: inherit;
    margin-top: 0.5rem;
    cursor: pointer;

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
    }
  }
`
