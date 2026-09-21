import type React from "react"
import { useEffect, useRef, useState } from "react"

type useDropdownType = () => [
  React.RefObject<HTMLDivElement | null>,
  boolean,
  () => void,
]

const useDropdown: useDropdownType = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpened, setIsDropdownOpened] = useState(false)

  useEffect(() => {
    if (!isDropdownOpened) return

    const handleClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setIsDropdownOpened(false)
      }
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [isDropdownOpened])

  const onOpenBtn = () => {
    setIsDropdownOpened(true)
  }

  return [menuRef, isDropdownOpened, onOpenBtn]
}

export default useDropdown
