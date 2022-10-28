import { NextPageWithLayout } from "pages/_app"
import { ReactElement } from "react"
import AccountLayout from "@/components/layouts/account/Layout"
const Page: NextPageWithLayout = () => {
  return (
    <>
      <div>tickets</div>
    </>
  )
}

Page.getLayout = (page: ReactElement) => {
  return <AccountLayout pageName="tickets">{page}</AccountLayout>
}

export default Page
