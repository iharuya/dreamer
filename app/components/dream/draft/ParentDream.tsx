import { FC } from "react"
import { Get as DraftGet } from "@/api/dreams/drafts/[id]"
import DreamCardOrPanel from "@/components/dream/published/CardOrPanel"

type Props = {
  dream: NonNullable<DraftGet["parent"]>
}
const Component: FC<Props> = ({ dream }) => {
  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
      <input type="checkbox" />
      <div className="collapse-title text-lg font-medium ">
        元のドリームを見る
      </div>
      <div className="collapse-content">
        <DreamCardOrPanel
          dreamId={dream.id}
          dreamTitle={dream.title}
          imageFilename={dream.image.filename}
          dreamer={dream.dreamer}
        />
      </div>
    </div>
  )
}

export default Component
