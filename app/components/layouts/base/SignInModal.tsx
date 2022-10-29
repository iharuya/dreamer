import { FC } from "react"

type Props = {
  proceed: () => void
  cancel: () => void
}
const Component: FC<Props> = ({ proceed, cancel }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">サインインしてください</h3>
        <p className="py-4">サインインにはウォレットで署名する必要があります</p>
        <div className="modal-action">
          <button className="btn" onClick={cancel}>
            キャンセル
          </button>
          <button className="btn btn-primary" onClick={proceed}>
            サインイン
          </button>
        </div>
      </div>
    </div>
  )
}

export default Component
