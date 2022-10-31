import { FC } from "react"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]/index"

type Props = {
  dream: TicketGet["dream"]
}
const Component: FC<Props> = ({ dream }) => {
  const dreamStatusToTitle = {
    PUBLISHED: "ドリーム",
    BANNED: "ドラフト",
    PENDING: "ドラフト",
    DRAFT: "ドラフト",
  }
  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
      <input type="checkbox" />
      <div className="collapse-title text-lg font-medium ">
        {dreamStatusToTitle[dream.status]}
      </div>
      <div className="collapse-content">
        <div className="text-base-content/80 flex-inline mb-2">
          <span className="text-xl mr-1">
            &gt;<span className="text-sm font-bold">_ </span>
          </span>
          <span>{dream.prompt}</span>
        </div>
        <div>
          <p className="text-sm text-base-content/80">
            {dream.caption || "キャプションなし"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Component
