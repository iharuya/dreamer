import { FC } from "react"
import Modal from "./Modal"

type Props = {
  message?: string
  code?: number
  modal?: boolean
  onClose?: () => void
}

const Component: FC<Props> = ({ message, code, modal, onClose }) => {
  const Base = (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="mb-2 text-2xl font-bold text-error">
        <span>エラー</span>
        {code !== undefined && <span> | {code}</span>}
      </div>
      {message && <p className="text-base-content/60">{message}</p>}
    </div>
  )
  if (modal) {
    return <Modal onClose={onClose}>{Base}</Modal>
  }
  return Base
}

export default Component
