import { FC } from "react"
import { BsQuestion } from "react-icons/bs"

type Props = {
  message: string
  position?: "top" | "right" | "bottom" | "left"
  size?: "base" | "lg" | "xl" | "2xl"
}
const Component: FC<Props> = ({
  message,
  position = "bottom",
  size = "xl",
}) => {
  return (
    <div className={`tooltip tooltip-${position}`} data-tip={message}>
      <button className="btn btn-sm btn-circle btn-outline ">
        <BsQuestion className={`text-${size}`} />
      </button>
    </div>
  )
}

export default Component
