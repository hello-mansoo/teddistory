import styled from "@emotion/styled"
import { useRouter } from "next/router"

type TOrder = "asc" | "desc"

const OrderButtons = () => {
  const router = useRouter()

  const currentOrder = `${router.query.order || ``}` || ("desc" as TOrder)

  const handleClickOrderBy = (value: TOrder) => {
    router.push({
      query: {
        ...router.query,
        order: value,
      },
    })
  }
  return (
    <StyledWrapper>
      <button
        type="button"
        data-active={currentOrder === "desc"}
        onClick={() => handleClickOrderBy("desc")}
      >
        Desc
      </button>
      <button
        type="button"
        data-active={currentOrder === "asc"}
        onClick={() => handleClickOrderBy("asc")}
      >
        Asc
      </button>
    </StyledWrapper>
  )
}

export default OrderButtons

const StyledWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  button {
    padding: 0;
    border: 0;
    font: inherit;
    background: transparent;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray10};

    &[data-active="true"] {
      font-weight: 700;

      color: ${({ theme }) => theme.colors.gray12};
    }
  }
`
