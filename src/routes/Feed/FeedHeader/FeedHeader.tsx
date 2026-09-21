import styled from "@emotion/styled"
import type { TPosts } from "src/types"
import CategorySelect from "./CategorySelect"
import OrderButtons from "./OrderButtons"

type Props = {
  posts: TPosts
}

const FeedHeader = ({ posts }: Props) => {
  return (
    <StyledWrapper>
      <CategorySelect posts={posts} />
      <OrderButtons />
    </StyledWrapper>
  )
}

export default FeedHeader

const StyledWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
`
