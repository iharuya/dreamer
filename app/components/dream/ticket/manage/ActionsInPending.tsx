import { FC } from "react"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]"
import { Get as BlockNumberGet } from "@/api/blockchain/general/current-block-number"
import MintButton from "./MintButton"
import { MdDelete } from "react-icons/md"

type Props = {
  ticket: TicketGet
  currentBlockNumber?: BlockNumberGet
  isMinted?: boolean
  onDream: () => void
  onUpdate: () => void
  onDelete: () => void
  onMinted: () => void
}
const Component: FC<Props> = ({
  ticket,
  currentBlockNumber,
  isMinted,
  onDream,
  onUpdate,
  onDelete,
  onMinted,
}) => {
  if (isMinted === undefined) {
    return <button className="btn loading btn-ghost">読み込み中</button>
  }

  if (isMinted) {
    return (
      <button className="btn btn-primary" onClick={onDream}>
        ドリーム
      </button>
    )
  }

  if (currentBlockNumber === undefined) {
    return <button className="btn loading btn-ghost">読み込み中</button>
  }

  if (ticket.expiresAt - currentBlockNumber >= 0) {
    return (
      <MintButton
        ticketId={ticket.id}
        tokenId={ticket.tokenId}
        expiresAt={ticket.expiresAt}
        signature={ticket.signature}
        onMinted={onMinted}
      />
    )
  }

  return (
    <>
      <button className="btn btn-square btn-error" onClick={onDelete}>
        <MdDelete className="text-3xl" />
      </button>
      <button className="btn" onClick={onUpdate}>
        期限を更新
      </button>
    </>
  )
}

export default Component
