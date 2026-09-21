import styled from "@emotion/styled"
import type { PostDetail as PostDetailType } from "src/types"
import useMermaidEffect from "./hooks/useMermaidEffect"
import PageDetail from "./PageDetail"
import PostDetail from "./PostDetail"

type Props = {
  data: PostDetailType
}

const Detail = ({ data }: Props) => {
  useMermaidEffect()

  return (
    <StyledWrapper data-type={data.type[0]}>
      {data.type[0] === "Page" && <PageDetail data={data} />}
      {data.type[0] !== "Page" && <PostDetail data={data} />}
    </StyledWrapper>
  )
}

export default Detail

const StyledWrapper = styled.div`
  padding: 2rem 0;

  &[data-type="Paper"] {
    padding: 40px 0;
  }
`
