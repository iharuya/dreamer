import { GetPublishedDream } from "@/schema/dreams"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { Get as DreamGet } from "@/api/dreams/[id]"
import useSWR from "swr"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"

const Page: NextPage = () => {
  const router = useRouter()
  const queryId = router.query.id as string
  const parsed = GetPublishedDream.shape.query.shape.id.safeParse(queryId)
  const isOkToLoadDream = parsed.success
  const { data: dream, error: dreamError } = useSWR<DreamGet>(
    isOkToLoadDream ? `/api/dreams/${queryId}` : null
  )

  if (!isOkToLoadDream) {
    return <Error code={400} message="ドリームは存在しません" />
  }
  if (dream === undefined && !dreamError)
    return <LScale message="ドリームをロード中..." />
  if (dream === undefined) {
    console.error(dreamError)
    return (
      <Error
        code={dreamError?.response?.status || 500}
        message="ドリームの取得に失敗しました"
      />
    )
  }

  return (
    <div className="space-y-4">
      <pre>
        <code>{JSON.stringify(dream, null, 2)}</code>
      </pre>
    </div>
  )
}

export default Page
