import { FC, useState } from "react"
import useSWR, { KeyedMutator } from "swr"
import { LScale } from "@/components/common/Loading"
import Error from "next/error"
import { MdDelete } from "react-icons/md"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]"
import { Get as TicketsGet } from "@/api/dreams/tickets/index"

type Props = {
  ticketId: number
  close: () => void
  ticketsMutate: KeyedMutator<TicketsGet>
}
const Component: FC<Props> = ({ ticketId, close, ticketsMutate }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const {
    data: ticket,
    error: ticketError,
    mutate: ticketMutate,
  } = useSWR<TicketGet>(`/api/dreams/tickets/${ticketId}`)
  if (ticket === undefined && !ticketError)
    return <LScale message="チケットをロード中..." />
  if (ticket === undefined) {
    console.error(ticketError)
    return <Error statusCode={ticketError?.response?.status || 500} />
  }

  // const update = async () => {
  //   axios
  //     .patch(`/api/dreams/tickets/${ticketId}`)
  //     .then(() => {
  //       ticketsMutate()
  //       close()
  //     })
  //     .catch((e) => {
  //       console.error(e)
  //       toast.error("ドラフト更新失敗")
  //     })
  // }

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box">
          <div className="flex mb-4 items-center">
            <h3 className="font-bold text-2xl">チケット</h3>
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
            <button className="btn">更新</button>
            <button className="btn">トークンをミント</button>
            <button className="btn">ドリーム</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Component
