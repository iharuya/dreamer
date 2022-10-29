import { FC } from "react"
import { toast } from "react-toastify"
import axios from "axios"

type Props = {
  senderAddress: string
  draftId: number
  close: () => void
  onIssue: () => void
}
const Component: FC<Props> = ({ senderAddress, draftId, close, onIssue }) => {
  const issue = async () => {
    axios
      .post("/api/dreams/tickets", { senderAddress, dreamId: draftId })
      .then(() => {
        toast.info("チケットを発行しました")
        onIssue()
        close()
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
        <div className="alert">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              チケットを発行すると、有効期限が切れるまでドラフトを編集することはできません。
            </span>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            issue()
          }}
        >
          <div className="modal-action">
            <button type="button" className="btn" onClick={close}>
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
