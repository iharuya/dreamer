import { FC } from "react"
import { useSwitchNetwork } from "wagmi"

type Props = {
  cancel: () => void
}
const Component: FC<Props> = ({ cancel }) => {
  const { switchNetwork, chains } = useSwitchNetwork()

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">ネットワークを変更してください</h3>
        <p className="py-4">
          対応するチェーン：{chains.map((chain) => chain.name).join(", ")}
        </p>
        <div className="modal-action">
          <button className="btn" onClick={cancel}>
            キャンセル
          </button>
          <button
            className="btn btn-primary normal-case"
            disabled={switchNetwork === undefined}
            onClick={() => {
              switchNetwork?.(chains[0].id)
            }}
          >
            {chains[0].name}に変更
          </button>
        </div>
      </div>
    </div>
  )
}

export default Component
