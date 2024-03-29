import { NextPage } from "next"
import useSWR from "swr"
import { Get as DreamsGet } from "@/api/dreams/published/index"
import { publishedDreamsFetcher } from "@/lib/fetchers"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import DreamCardOrPanel from "@/components/dream/published/CardOrPanel"

const Page: NextPage = () => {
  const { data: dreams, error: dreamsError } = useSWR<DreamsGet>(
    ["publishedDreams", null],
    publishedDreamsFetcher
  )

  if (dreams === undefined && !dreamsError)
    return <LScale message="ドリームをロード中..." />
  if (dreams === undefined) {
    console.error(dreamsError)
    return (
      <Error
        code={dreamsError?.response?.status || 500}
        message="ドリームの取得に失敗しました"
      />
    )
  }

  return (
    <div className="mb-24">
      <div className="px-4 md:px-0 mb-2">
        <h1 className="font-bold text-xl">新着</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 md:gap-2 lg:grid-cols-4">
        {dreams.map((dream) => (
          <DreamCardOrPanel
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

export default Page
