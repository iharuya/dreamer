import { GetPublishedDream } from "@/schema/dreams"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { Get as DreamGet } from "@/api/dreams/published/[id]"
import useSWR from "swr"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import Main from "@/components/dream/published/detail/Main"
import Token from "@/components/dream/published/detail/Token"

const Page: NextPage = () => {
  const router = useRouter()
  const queryId = router.query.id as string
  const parsed = GetPublishedDream.shape.query.shape.id.safeParse(queryId)
  const isOkToLoadDream = parsed.success
  const { data: dream, error: dreamError } = useSWR<DreamGet>(
    isOkToLoadDream ? `/api/dreams/published/${queryId}` : null
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
    <div className="py-8 px-4 md:px-0 flex flex-wrap space-y-8 lg:space-y-0">
      <section className="w-full lg:w-3/5">
        <Main dream={dream} />
      </section>

      <section className="w-full lg:w-2/5">
        <div className="w-full md:w-1/2 lg:w-full">
          <Token tokenId={dream.ticket.tokenId} />
        </div>
      </section>

      <pre>
        <code>{JSON.stringify(dream, null, 2)}</code>
      </pre>
    </div>
  )
}

export default Page
