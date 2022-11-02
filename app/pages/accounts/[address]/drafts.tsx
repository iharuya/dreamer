import { NextPageWithLayout } from "pages/_app"
import { ReactElement, useState } from "react"
import AccountLayout from "@/components/layouts/account/Layout"
import useSWR from "swr"
import { useMyAccount } from "@/lib/hooks"
import { LScale } from "@/components/common/Loading"
import Error from "@/components/common/Error"
import DraftItem from "@/components/dream/draft/Item"
import ManageDraftModal from "@/components/dream/draft/ManageModal"
import { draftsFetcher } from "@/lib/fetchers"
import { Get as DraftsGet } from "@/api/dreams/drafts/index"

const Page: NextPageWithLayout = () => {
  const { data: myAccount } = useMyAccount()
  const {
    data: drafts,
    error: draftsError,
    mutate: draftsMutate,
  } = useSWR<DraftsGet>(
    myAccount ? ["drafts", myAccount.address] : null,
    draftsFetcher
  )
  const [managingDraftId, setManagingDraftId] = useState<number | undefined>()

  if (drafts === undefined && !draftsError)
    return <LScale message="ドラフトをロード中..." />
  if (drafts === undefined) {
    console.error(draftsError)
    return (
      <Error
        code={draftsError?.response?.status || 500}
        message="ドラフトの取得に失敗しました"
      />
    )
  }

  return (
    <div className="px-4 md:px-0">
      {drafts.length > 0 ? (
        <>
          <div className="flex flex-col space-y-4">
            {drafts.map((draft) => (
              <DraftItem
                key={draft.id}
                draft={draft}
                onClick={() => setManagingDraftId(draft.id)}
              />
            ))}
          </div>
          {managingDraftId !== undefined && (
            <ManageDraftModal
              draftId={managingDraftId}
              close={() => setManagingDraftId(undefined)}
              draftsMutate={draftsMutate}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center pt-12 space-y-4 text-base-content/60">
          <span className="text-2xl font-bold">ドラフトをつくろう</span>
          {/* Todo: 新しく作るボタン（作成モーダルのglobal state化） */}
          <span>右下のペンマークから</span>
        </div>
      )}
    </div>
  )
}

Page.getLayout = (page: ReactElement) => {
  return <AccountLayout pageName="drafts">{page}</AccountLayout>
}

export default Page
