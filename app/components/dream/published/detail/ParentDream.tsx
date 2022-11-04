import { FC } from "react"
import { Get as DreamGet } from "@/api/dreams/published/[id]"
import DreamCard from "@/components/dream/published/Card"

type Props = {
  dream: NonNullable<DreamGet["parent"]>
}
const Component: FC<Props> = ({ dream }) => {
  return (
    <div className="">
      <h2 className="text-xl font-bold mb-2">元のドリーム</h2>
      <DreamCard
        dreamId={dream.id}
        dreamTitle={dream.title}
        imageFilename={dream.image.filename}
        dreamer={dream.dreamer}
      />
    </div>
  )
}

export default Component
