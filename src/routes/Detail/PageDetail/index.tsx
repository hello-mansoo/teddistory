import styled from "@emotion/styled"
import type { PostDetail } from "src/types"
import NotionRenderer from "../components/NotionRenderer"

type Props = {
  data: PostDetail
}

const PageDetail = ({ data }: Props) => {
  return (
    <StyledWrapper>
      <NotionRenderer recordMap={data.recordMap} />
    </StyledWrapper>
  )
}

export default PageDetail

const StyledWrapper = styled.div`
  margin: 0 auto;
  max-width: 56rem;
`
