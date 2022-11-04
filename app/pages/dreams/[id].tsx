import { GetPublishedDream } from "@/schema/dreams"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { Get as DreamGet } from "@/api/dreams/published/[id]"
import useSWR from "swr"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import Main from "@/components/dream/published/detail/Main"
import Token from "@/components/dream/published/detail/Token"
import ParentDream from "@/components/dream/published/detail/ParentDream"
import ChildDreams from "@/components/dream/published/detail/ChildDreams"

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
    <div className="py-8 px-4 grid grid-cols-12 gap-x-4 gap-y-8 md:px-0 mb-24">
      <section className="col-span-12 lg:col-span-8">
        <Main dream={dream} />
      </section>

      <section className="col-span-12 lg:col-span-4">
        <div className="grid grid-cols-12 gap-x-4 gap-y-8">
          <div className="col-span-12 sm:col-span-7 md:col-span-8 lg:col-span-12">
            <Token tokenId={dream.ticket.tokenId} />
          </div>

          {dream.parent ? (
            <div className="col-span-8 sm:col-span-5 md:col-span-4 lg:col-span-12">
              <ParentDream dream={dream.parent} />
            </div>
          ) : (
            <div className="col-span-12 sm:col-span-5 md:col-span-4 lg:col-span-12">
              <h2 className="font-bold text-xl badge badge-accent badge-lg mb-2">
                Root Dream
              </h2>
              <p>
                これが<span className="px-1">&quot;{dream.title}&quot;</span>
                からはじまる伝説のドリームの幕開けだ！
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="col-span-12">
        <ChildDreams dreams={dream.children} />
      </section>
    </div>
  )
}

export default Page
