import { FC, useState } from "react"
import useSWR, { KeyedMutator } from "swr"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]/index"
import { Get as TicketsGet } from "@/api/dreams/tickets/index"
import { Get as BlockNumberGet } from "@/api/blockchain/general/current-block-number"
import { BLOCK_TIME } from "@/constants/chain"
import TicketStatus from "./Status"
import TicketDream from "./Dream"
import MintModal from "./MintModal"
import { MdDelete } from "react-icons/md"
import DeleteModal from "@/components/common/DeleteModal"
import axios from "axios"
import { toast } from "react-toastify"

// Todo: Jump to the dream page if completed and not nsfw

type Props = {
  ticketId: number
  close: () => void
  ticketsMutate: KeyedMutator<TicketsGet>
}
const Component: FC<Props> = ({ ticketId, close, ticketsMutate }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [isMintOpen, setIsMintOpen] = useState<boolean>(false)

  const {
    data: ticket,
    error: ticketError,
    mutate: ticketMutate,
  } = useSWR<TicketGet>(`/api/dreams/tickets/${ticketId}`)
  const isPending = ticket?.status === "PENDING"

  const { data: currentBlockNumber, mutate: blockNumerMutate } =
    useSWR<BlockNumberGet>(
      isPending ? "/api/blockchain/general/current-block-number" : null,
      {
        refreshInterval: BLOCK_TIME * 1000,
      }
    )

  const {
    data: isMinted,
    mutate: isMintedMutate,
    isValidating: isMintedValidating,
    error: isMintedError,
  } = useSWR<boolean>(
    isPending ? `/api/dreams/tickets/${ticketId}/is-dream-minted` : null
  )

  const ticketLoading = ticket === undefined && !ticketError
  const isMintedLoading = isPending && isMintedValidating
  if (ticketLoading || isMintedLoading)
    return <LScale message="チケットをロード中..." modal />
  if (ticket === undefined || isMintedError) {
    return (
      <Error
        code={ticketError?.response?.status || 500}
        message="チケットの取得に失敗しました"
        modal
        onClose={close}
      />
    )
  }

  const reload = async () => {
    ticketMutate()
    blockNumerMutate()
    isMintedMutate()
  }

  const handleUpdate = async () => {
    axios
      .patch(`/api/dreams/tickets/${ticket.id}`)
      .then(() => {
        reload()
      })
      .catch((e) => {
        console.error(e)
        toast.error("チケット更新失敗")
      })
  }
  const handleDelete = async () => {
    axios
      .delete(`/api/dreams/tickets/${ticket.id}`)
      .then(() => {
        ticketsMutate()
        close()
      })
      .catch((e) => {
        console.error(e)
        toast.error("チケット削除失敗")
      })
  }

  return (
    <>
      <div className="modal modal-open modal-bottom md:modal-middle">
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
            <button className="btn mr-auto" onClick={close}>
              とじる
            </button>
            <div className="flex items-center space-x-2">
              {ticket.status === "PENDING" &&
                (isMinted ? (
                  <button className="btn btn-primary">ドリーム</button>
                ) : currentBlockNumber !== undefined ? (
                  ticket.expiresAt - currentBlockNumber < 0 ? (
                    <>
                      <button
                        className="btn btn-square btn-error"
                        onClick={() => setIsDeleteOpen(true)}
                      >
                        <MdDelete className="text-3xl" />
                      </button>
                      <button className="btn" onClick={handleUpdate}>
                        期限を更新
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsMintOpen(true)}
                    >
                      トークンをミント
                    </button>
                  )
                ) : (
                  <span>ブロック取得中...</span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {isMintOpen && (
        <MintModal
          ticketId={ticket.id}
          tokenId={ticket.tokenId}
          expiresAt={ticket.expiresAt}
          signature={ticket.signature}
          onClose={() => setIsMintOpen(false)}
          onMint={() => console.log("minted!")}
        />
      )}

      {isDeleteOpen && (
        <DeleteModal
          title="チケットを削除しますか？"
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={() => handleDelete()}
        />
      )}
    </>
  )
}

export default Component
