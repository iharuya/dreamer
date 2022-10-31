import { FC } from "react"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]/index"

type Props = {
  ticket: TicketGet
  onClick: () => void
}
const Component: FC<Props> = ({ ticket, onClick }) => {
  return (
    <div className="card w-full border shadow-sm" onClick={onClick}>
      <div className="card-body px-6 py-4">
        <h2 className="text-lg font-bold truncate">{ticket.dream.title}</h2>
        <div className="text-base-content/80 flex items-center">
          <span className="text-xl mr-1">
            &gt;<span className="text-sm font-bold">_ </span>
          </span>
          <p className="truncate">{ticket.dream.prompt}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            {ticket.status === "PENDING" && (
              <span className="badge badge-info">確認してください</span>
            )}
            {ticket.status === "PROCESSING" && (
              <span className="badge badge-accent">処理中</span>
            )}
            {ticket.status === "COMPLETED" && (
              <span className="badge">完了</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component
