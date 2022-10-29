import { NextPageWithLayout } from "pages/_app"
import { ReactElement, useState } from "react"
import AccountLayout from "@/components/layouts/account/Layout"
import useSWR from "swr"
import { useMyAccount } from "@/lib/hooks"
import Error from "next/error"
import { LScale } from "@/components/common/Loading"
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
    return <Error statusCode={draftsError?.response?.status || 500} />
  }

  return (
    <>
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
        <div className="flex flex-col justify-center items-center h-36 space-y-4 text-base-content/60">
          <span className="text-2xl font-bold">ドラフトをつくろう</span>
          {/* Todo: 新しく作るボタン（作成モーダルのglobal state化） */}
          <span>右下のペンマークから</span>
        </div>
      )}
    </>
  )
}

Page.getLayout = (page: ReactElement) => {
  return <AccountLayout pageName="drafts">{page}</AccountLayout>
}

export default Page
