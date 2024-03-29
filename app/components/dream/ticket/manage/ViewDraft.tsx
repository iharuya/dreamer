import { FC } from "react"
import { Get as TicketGet } from "@/api/dreams/tickets/[id]"
import Link from "next/link"

type Props = {
  dream: TicketGet["dream"]
}
const Component: FC<Props> = ({ dream }) => {
  const dreamStatusToTitle = {
    PUBLISHED: "投稿したドリームのドラフト",
    BANNED: "禁止されたドリームのドラフト",
    PENDING: "ドラフト",
    DRAFT: "ドラフト", // should not be the case
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
        {dream.parentId !== null && (
          <div className="mt-4">
            <Link href={`/dreams/${dream.parentId}`}>
              <a className="btn btn-info btn-sm">元のドリーム</a>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Component
