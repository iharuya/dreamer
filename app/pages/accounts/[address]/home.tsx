import { NextPageWithLayout } from "pages/_app"
import AccountLayout from "@/components/layouts/account/Layout"
import { ReactElement } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import useSWR from "swr"
import { Get as DreamsGet } from "@/api/dreams/index"
import { publishedDreamsFetcher } from "@/lib/fetchers"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import DreamCard from "@/components/dream/published/Card"

const Page: NextPageWithLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const queryAddress = router.query.address as string
  const { data: dreams, error: dreamsError } = useSWR<DreamsGet>(
    ["publishedDreams", queryAddress],
    publishedDreamsFetcher
  )

  const isMe = queryAddress === session?.address

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
    <div>
      {dreams.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-2 lg:grid-cols-4">
          {dreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center py-12 space-y-4 text-base-content/60">
          <span className="text-2xl font-bold">まだドリームしていません</span>
          {isMe && (
            <div>
              <p className="text-center text-lg">ドリームまでの手順</p>
              <ol className="list-decimal">
                <li>ドラフトを作成（右下のペンマークから）</li>
                <li>ドラフト管理画面からチケットを発行</li>
                <li>チケット管理画面からトークンを購入</li>
                <li>ドリームボタンを押す</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

Page.getLayout = (page: ReactElement) => {
  return <AccountLayout pageName="home">{page}</AccountLayout>
}

export default Page
