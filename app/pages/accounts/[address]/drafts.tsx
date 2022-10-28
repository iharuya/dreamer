import { NextPageWithLayout } from "pages/_app"
import { ReactElement } from "react"
import AccountLayout from "@/components/layouts/account/Layout"
const Page: NextPageWithLayout = () => {
  return (
    <>
      <div>drafts</div>
    </>
  )
}

Page.getLayout = (page: ReactElement) => {
  return <AccountLayout pageName="drafts">{page}</AccountLayout>
}

export default Page
