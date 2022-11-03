import { GetPublishedDream } from "@/schema/dreams"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { Get as DreamGet } from "@/api/dreams/[id]"
import useSWR from "swr"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import Image from "next/image"
import Link from "next/link"
import Avatar from "@/components/common/Avatar"
import ReadMore from "@/components/common/ReadMore"
import { BiRefresh } from "react-icons/bi"
import Token from "@/components/dream/published/Token"

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
    <div className="py-8 px-4 md:px-0 flex flex-wrap space-y-8 lg:space-y-0">
      {/* About this dream (Base info) */}
      <section className="w-full lg:w-3/5">
        <figure className="text-center">
          <Image
            src={`/seed-images/${dream.image.filename}`}
            alt={dream.title}
            width="512px"
            height="512px"
          />
        </figure>
        <div>
          <h1 className="text-xl font-bold py-2">{dream.title}</h1>
          <div className="flex">
            <Link href={`/accounts/${dream.dreamer.address}/home`}>
              <a className="inline-flex items-center hover:opacity-60 overflow-hidden">
                <span className="mr-2">
                  <Avatar size={40} address={dream.dreamer.address} />
                </span>
                <span className="text-base-content/90 font-bold text-lg truncate">
                  {dream.dreamer.name || "ななしさん"}
                </span>
              </a>
            </Link>
            <div className="ml-auto">
              <button className="btn btn-primary flex flex-nowrap">
                <BiRefresh className="text-3xl" />
                <span className="hidden md:inline whitespace-nowrap">
                  リドリーム
                </span>
                <span className="ml-1 md:ml-2 text-lg font-bold">
                  {dream.children.length}
                </span>
              </button>
            </div>
          </div>

          <div className="py-2">
            <ReadMore defaultHeight={120} className="rounded-lg bg-base-200">
              <div className="p-2">
                <p className="font-medium" suppressHydrationWarning>
                  {`${new Date(dream.publishedAt).toLocaleDateString()} に投稿`}
                </p>
                {dream.caption && (
                  <div className="whitespace-pre-wrap py-2">
                    {dream.caption}
                  </div>
                )}
              </div>
            </ReadMore>
          </div>

          <div className="py-2">
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg">
              <input type="checkbox" />
              <div className="collapse-title">プロンプトを見る</div>
              <div className="collapse-content text-base-content/80">
                <p>{dream.prompt}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token, Parent/children */}
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
