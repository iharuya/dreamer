import { FC, useState } from "react"
import useSWR, { KeyedMutator } from "swr"
import { LScale } from "@/components/common/Loading"
import Error from "next/error"
import { MdDelete } from "react-icons/md"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]/index"
import { Get as TicketsGet } from "@/api/dreams/tickets/index"
import { Get as BlockNumberGet } from "@/api/blockchain/current-block-number"
import { BLOCK_TIME } from "@/constants/chain"
import TicketStatus from "./Status"
import TicketDream from "./Dream"

// Todo: Jump to the dream page if completed and not nsfw

type Props = {
  ticketId: number
  close: () => void
  ticketsMutate: KeyedMutator<TicketsGet>
}
const Component: FC<Props> = ({ ticketId, close, ticketsMutate }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
  const {
    data: ticket,
    error: ticketError,
    mutate: ticketMutate,
  } = useSWR<TicketGet>(`/api/dreams/tickets/${ticketId}`)

  const { data: currentBlockNumber, mutate: blockNumerMutate } =
    useSWR<BlockNumberGet>(
      ticket?.status === "PENDING"
        ? "/api/blockchain/current-block-number"
        : null,
      {
        refreshInterval: BLOCK_TIME * 1000,
      }
    )

  const { data: isMinted, mutate: isMintedMutate } = useSWR<boolean>(
    ticket?.status === "PENDING"
      ? `/api/dreams/tickets/${ticketId}/is-dream-minted`
      : null
  )

  const reload = async () => {
    ticketMutate()
    blockNumerMutate()
    isMintedMutate()
  }

  if (ticket === undefined && !ticketError)
    return <LScale message="チケットをロード中..." />
  if (ticket === undefined) {
    console.error(ticketError)
    return <Error statusCode={ticketError?.response?.status || 500} />
  }

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <div className="flex mb-2 items-center">
            <h3 className="font-bold text-2xl">ドリームチケット</h3>
            {ticket.status !== "COMPLETED" && (
              <button className="btn ml-auto" onClick={reload}>
                リロード
              </button>
            )}
          </div>
          <h4 className="text-lg font-bold">{ticket.dream.title}</h4>
          <div className="mb-2">
            <TicketStatus
              ticket={ticket}
              currentBlockNumber={currentBlockNumber}
            />
          </div>
          <div>
            <TicketDream dream={ticket.dream} />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-square btn-error mr-auto"
              onClick={() => setIsDeleteOpen(true)}
            >
              <MdDelete className="text-3xl" />
            </button>
            <button className="btn" onClick={close}>
              とじる
            </button>
            <button className="btn">期限を更新</button>
            <button className="btn">トークンをミント</button>
            <button className="btn">ドリーム</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Component
