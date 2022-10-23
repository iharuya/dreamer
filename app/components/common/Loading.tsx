import { FC } from "react"
import ScaleLoader from "react-spinners/ScaleLoader"

type Props = {
  message?: string
  color?: string
}

export const LScale: FC<Props & { width?: number; height?: number }> = ({
  message,
  color,
  width,
  height,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="py-4">
        <ScaleLoader color={color || "#aaa"} width={width} height={height} />
      </div>
      {message && <p className="text-base-content/60">{message}</p>}
    </div>
  )
}
