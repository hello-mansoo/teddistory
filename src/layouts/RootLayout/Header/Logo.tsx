import styled from "@emotion/styled"
import Link from "next/link"
import { CONFIG } from "site.config"

const Logo = () => {
  return (
    <StyledWrapper href="/" aria-label={CONFIG.blog.header}>
      {CONFIG.blog.header}
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)`
  font-size: 1.1rem;
  font-weight: 600;
`
