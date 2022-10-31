import { FC } from "react"

type Props = {
  title: string
  onCancel: () => void
  onDelete: () => void
}
const Component: FC<Props> = ({ title, onCancel, onDelete }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex mb-4 items-center">
          <h3 className="font-bold text-2xl">{title}</h3>
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
