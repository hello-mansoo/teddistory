import { ReactNode } from "react"

type Props = {
  className?: string
  children?: ReactNode
}

export const Emoji = ({ className, children }: Props) => {
  return (
    <span className={className}>
      {children}
    </span>
  )
}
