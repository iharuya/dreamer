import type { ReactElement } from "react"
import AppLayout from "@/components/layouts/app/Layout"
import { useAccount } from "wagmi"

const Page = () => {
  const { address: connectedAddress } = useAccount()

  return (
    <>
      <p>hello</p>
      <p>{process.env.NODE_ENV}</p>
      <p>{connectedAddress}</p>
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>
}

export default Page
