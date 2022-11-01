import { FC } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { InfoAlert } from "@/components/common/Alert"

type Props = {
  senderAddress: string
  draftId: number
  onClose: () => void
  onIssue: () => void
}
const Component: FC<Props> = ({ senderAddress, draftId, onClose, onIssue }) => {
  const handleIssue = async () => {
    axios
      .post("/api/dreams/tickets", { senderAddress, dreamId: draftId })
      .then(() => {
        toast.info("チケットを発行しました")
        onIssue()
        onClose()
      })
      .catch((e) => {
        console.error(e)
        toast.error("チケット発行失敗")
      })
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-2xl mb-4">チケットを発行</h3>
        <InfoAlert message="チケットを発行すると、有効期限が切れるまでドラフトを編集することはできません。" />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleIssue()
          }}
        >
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary">
              発行
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Component
