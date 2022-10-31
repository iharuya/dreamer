import { FC } from "react"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]"
import { Get as BlockNumberGet } from "@/api/blockchain/general/current-block-number"
import { BLOCK_MARGIN } from "@/constants/chain"
import { ClipLoader } from "react-spinners"

type Props = {
  ticket: TicketGet
  currentBlockNumber?: BlockNumberGet
}
const Component: FC<Props> = ({ ticket, currentBlockNumber }) => {
  return (
    <>
      {ticket.status === "COMPLETED" ? (
        <span className="badge">完了</span>
      ) : ticket.status === "PROCESSING" ? (
        <span className="badge badge-accent">処理中</span>
      ) : currentBlockNumber !== undefined ? (
        ticket.expiresAt - currentBlockNumber >= BLOCK_MARGIN ? (
          <span className="badge badge-primary">
            有効：あと{ticket.expiresAt - currentBlockNumber}ブロック
          </span>
        ) : ticket.expiresAt - currentBlockNumber >= 0 ? (
          <span className="badge badge-warning">
            トランザクションは失敗する可能性が高いです
          </span>
        ) : (
          <span className="badge badge-accent">操作が必要です</span>
        )
      ) : (
        <span className="inline-flex items-center">
          <span className="mr-2">現在のブロックを読み込み中</span>
          <ClipLoader size={24} color="#aaaaaa" />
        </span>
      )}
    </>
  )
}

export default Component
