import { FC } from "react"
import { InfoAlert } from "./Alert"

type Props = {
  title: string
  info?: string
  onCancel: () => void
  onDelete: () => void
}
const Component: FC<Props> = ({ title, info, onCancel, onDelete }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex flex-col mb-4 space-y-2">
          <h3 className="font-bold text-2xl">{title}</h3>
          {info && <InfoAlert message={info} />}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onDelete()
          }}
        >
          <div className="modal-action">
            <button type="button" className="btn" onClick={onCancel}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-error">
              削除
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Component
