import { FC } from "react"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]"
import { Get as BlockNumberGet } from "@/api/blockchain/general/current-block-number"
import { BLOCK_MARGIN } from "@/constants/chain"
import { ClipLoader } from "react-spinners"

type Props = {
  ticket: TicketGet
  currentBlockNumber?: BlockNumberGet
  isMinted?: boolean
}
const Component: FC<Props> = ({ ticket, currentBlockNumber, isMinted }) => {
  if (ticket.status === "COMPLETED") {
    return <span className="badge">完了</span>
  }

  if (ticket.status === "PROCESSING") {
    return <span className="badge badge-accent">処理中</span>
  }

  if (isMinted === undefined) {
    return (
      <span className="badge badge-ghost">
        <span className="mr-2">読み込み中</span>
        <ClipLoader size={18} color="#aaaaaa" />
      </span>
    )
  }

  if (isMinted) {
    return <span className="badge badge-primary">ドリームの準備完了！</span>
  }

  if (currentBlockNumber === undefined) {
    return (
      <span className="badge badge-ghost">
        <span className="mr-2">読み込み中</span>
        <ClipLoader size={18} color="#aaaaaa" />
      </span>
    )
  }

  if (ticket.expiresAt - currentBlockNumber >= BLOCK_MARGIN) {
    return (
      <span className="badge badge-primary">
        有効：あと{ticket.expiresAt - currentBlockNumber}ブロック
      </span>
    )
  }

  if (ticket.expiresAt - currentBlockNumber >= 0) {
    return (
      <span className="badge badge-warning">
        トランザクションは失敗する可能性が高いです
      </span>
    )
  }

  return <span className="badge badge-accent">操作が必要です</span>
}

export default Component
