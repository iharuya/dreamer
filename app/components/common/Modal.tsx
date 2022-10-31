import { FC, ReactNode } from "react"

type Props = {
  children: ReactNode
  onClose?: () => void
}
export const Component: FC<Props> = ({ children, onClose }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div>{children}</div>
        {onClose !== undefined && (
          <div className="modal-action">
            <button className="btn" onClick={onClose}>
              とじる
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Component
