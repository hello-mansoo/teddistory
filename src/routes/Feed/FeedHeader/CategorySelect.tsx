import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { MdExpandMore } from "react-icons/md"
import { DEFAULT_CATEGORY } from "src/constants"
import useDropdown from "src/hooks/useDropdown"
import { getAllSelectItemsFromPosts } from "src/libs/utils/notion"
import type { TPosts } from "src/types"

type Props = {
  posts: TPosts
}

const CategorySelect = ({ posts }: Props) => {
  const router = useRouter()
  const data = {
    [DEFAULT_CATEGORY]: posts.length,
    ...getAllSelectItemsFromPosts("category", posts),
  }
  const [dropdownRef, opened, handleOpen] = useDropdown()

  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY

  const handleOptionClick = (category: string) => {
    router.push({
      query: {
        ...router.query,
        category,
      },
    })
  }
  return (
    <StyledWrapper ref={dropdownRef}>
      <button type="button" className="wrapper" onClick={handleOpen}>
        {currentCategory} Posts <MdExpandMore />
      </button>
      {opened && (
        <div className="content">
          {Object.keys(data).map((key) => (
            <button
              type="button"
              className="item"
              key={key}
              onClick={() => handleOptionClick(key)}
            >
              {`${key} (${data[key]})`}
            </button>
          ))}
        </div>
      )}
    </StyledWrapper>
  )
}

export default CategorySelect

const StyledWrapper = styled.div`
  position: relative;
  > .wrapper {
    display: flex;
    padding: 0;
    border: 0;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    gap: 0.25rem;
    align-items: center;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
    font-family: inherit;
    color: inherit;
    background: transparent;
    cursor: pointer;
  }
  > .content {
    position: absolute;
    z-index: 40;
    padding: 0.25rem;
    border-radius: 0.75rem;
    background-color: ${({ theme }) => theme.colors.gray2};
    color: ${({ theme }) => theme.colors.gray10};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    > .item {
      display: block;
      width: 100%;
      border: 0;
      padding: 0.25rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      white-space: nowrap;
      font-family: inherit;
      color: inherit;
      text-align: left;
      background: transparent;
      cursor: pointer;

      :hover {
        background-color: ${({ theme }) => theme.colors.gray4};
      }
    }
  }
`
