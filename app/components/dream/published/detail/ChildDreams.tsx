import { FC } from "react"
import { Get as DreamGet } from "@/api/dreams/published/[id]"
import DreamCard from "@/components/dream/published/Card"

type Props = {
  dreams: DreamGet["children"]
}
const Component: FC<Props> = ({ dreams }) => {
  if (dreams.length === 0) {
    return (
      <div className="py-12 flex flex-col text-center text-base-content/60">
        <h2 className="text-xl font-bold">まだ誰もリドリームしていません</h2>
      </div>
    )
  }
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">リドリーム</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {dreams.map((dream) => (
          <DreamCard
            key={dream.id}
            dreamId={dream.id}
            dreamTitle={dream.title}
            imageFilename={dream.image.filename}
            dreamer={dream.dreamer}
          />
        ))}
      </div>
    </div>
  )
}

export default Component
