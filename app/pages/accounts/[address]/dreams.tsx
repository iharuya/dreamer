import { NextPageWithLayout } from "pages/_app"
import { ReactElement } from "react"
import AccountLayout from "@/components/layouts/account/Layout"
const Page: NextPageWithLayout = () => {
  return (
    <>
      <div>dreams</div>
    </>
  )
}

Page.getLayout = (page: ReactElement) => {
  return <AccountLayout pageName="dreams">{page}</AccountLayout>
}

export default Page
