import { FC } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { Dream } from "@prisma/client"

type Props = {
  draft: Dream
  close: () => void
  onDelete: () => void
}
const Component: FC<Props> = ({ draft, close, onDelete }) => {
  const deleteDraft = async () => {
    axios
      .delete(`/api/dreams/drafts/${draft.id}`)
      .then(() => {
        onDelete()
        close()
      })
      .catch((e) => {
        console.error(e)
        toast.error("ドラフト削除失敗")
      })
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex mb-4 items-center">
          <h3 className="font-bold text-2xl">ドラフトを削除しますか？</h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            deleteDraft()
          }}
        >
          <div className="modal-action">
            <button type="button" className="btn" onClick={close}>
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
