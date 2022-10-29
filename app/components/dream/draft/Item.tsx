import { FC } from "react"
import { Get as DraftGet } from "@/api/dreams/drafts/[id]"
type Props = {
  draft: DraftGet
  onClick: () => void
}
const Component: FC<Props> = ({ draft, onClick }) => {
  return (
    <div className="card w-full border shadow-sm" onClick={onClick}>
      <div className="card-body px-6 py-4">
        <h2 className="text-lg font-bold truncate">{draft.title}</h2>
        <div className="text-base-content/80 flex items-center">
          <span className="text-xl mr-1">
            &gt;<span className="text-sm font-bold">_ </span>
          </span>
          <p className="truncate">{draft.prompt}</p>
        </div>
        <p className="text-sm text-base-content/80 truncate">
          {draft.caption || "キャプションなし"}
        </p>
      </div>
    </div>
  )
}

export default Component
