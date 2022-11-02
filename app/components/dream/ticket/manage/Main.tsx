import { FC, useState } from "react"
import useSWR, { KeyedMutator } from "swr"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]"
import { Get as TicketsGet } from "@/api/dreams/tickets/index"
import { Get as BlockNumberGet } from "@/api/blockchain/general/current-block-number"
import { Post as ImagePost } from "@/api/dreams/images"
import { BLOCK_TIME } from "@/constants/chain"
import TicketStatus from "./Status"
import ActionsInPending from "./ActionsInPending"
import TicketDream from "./Dream"
import DeleteModal from "@/components/common/DeleteModal"
import axios from "axios"
import { toast } from "react-toastify"
import { MdRefresh } from "react-icons/md"

// Todo: Jump to the dream page if completed and not nsfw

type Props = {
  ticketId: string
  close: () => void
  ticketsMutate: KeyedMutator<TicketsGet>
}
const Component: FC<Props> = ({ ticketId, close, ticketsMutate }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [isDreamingOpen, setIsDreamingOpen] = useState<boolean>(false)

  const {
    data: ticket,
    error: ticketError,
    mutate: ticketMutate,
  } = useSWR<TicketGet>(`/api/dreams/tickets/${ticketId}`)
  const isPending = ticket?.status === "PENDING"

  const {
    data: isMinted,
    mutate: isMintedMutate,
    isValidating: isMintedValidating,
    error: isMintedError,
  } = useSWR<boolean>(
    isPending
      ? `/api/blockchain/dreams/is-dream-minted?ticketId=${ticket.id}`
      : null
  )

  const { data: currentBlockNumber, mutate: blockNumerMutate } =
    useSWR<BlockNumberGet>(
      isPending ? "/api/blockchain/general/current-block-number" : null,
      {
        refreshInterval: BLOCK_TIME * 1000,
      }
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

  const handleDream = async () => {
    setIsDreamingOpen(true)
    try {
      const res = await axios.post(`/api/dreams/images`, {
        dreamId: ticket.dreamId,
      })
      const newDream = res.data as ImagePost
      if (newDream.status === "BANNED") {
        toast.warning("ドリームはNSFWで禁止されました")
      } else if (newDream.status === "PUBLISHED") {
        toast.success("ドリームが成功し、投稿が完了しました！")
      }
      reload()
      ticketsMutate()
    } catch (err) {
      console.error(err)
      toast.error("ドリームに失敗しました。後でやり直してください。")
    }
    setIsDreamingOpen(false)
  }

  const handleUpdate = async () => {
    axios
      .patch(`/api/dreams/tickets/${ticket.id}`)
      .then(() => {
        reload()
      })
      .catch((err) => {
        console.error(err)
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
      .catch((err) => {
        console.error(err)
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
              <button className="btn btn-circle ml-auto" onClick={reload}>
                <MdRefresh className="text-3xl" />
              </button>
            )}
          </div>
          <h4 className="text-lg font-bold">{ticket.dream.title}</h4>
          <div className="mb-2">
            <TicketStatus
              ticket={ticket}
              currentBlockNumber={currentBlockNumber}
              isMinted={isMinted}
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
              {ticket.status === "PENDING" && (
                <ActionsInPending
                  ticket={ticket}
                  currentBlockNumber={currentBlockNumber}
                  isMinted={isMinted}
                  onDream={() => handleDream()}
                  onUpdate={() => handleUpdate()}
                  onDelete={() => setIsDeleteOpen(true)}
                  onMinted={() => reload()}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {isDeleteOpen && (
        <DeleteModal
          title="チケットを削除しますか？"
          info="削除するとドリームはドラフト状態に戻ります"
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={() => handleDelete()}
        />
      )}

      {isDreamingOpen && <LScale message="ドリーム中" modal />}
    </>
  )
}

export default Component
