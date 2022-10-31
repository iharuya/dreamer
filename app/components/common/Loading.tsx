import { FC } from "react"
import ScaleLoader from "react-spinners/ScaleLoader"
import Modal from "./Modal"

type CommonProps = {
  message?: string
  color?: string
  modal?: boolean
}

export const LScale: FC<CommonProps & { width?: number; height?: number }> = ({
  message,
  color,
  width,
  height,
  modal,
}) => {
  const Base = (
    <div className="flex flex-col items-center justify-center">
      <div className="py-4">
        <ScaleLoader color={color || "#aaa"} width={width} height={height} />
      </div>
      {message && <p className="text-base-content/60">{message}</p>}
    </div>
  )
  if (modal) {
    return <Modal>{Base}</Modal>
  }
  return Base
}
