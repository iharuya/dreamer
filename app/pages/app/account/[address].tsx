import { useRouter } from "next/router"
import { ReactElement, useEffect, useState } from "react"
import AppLayout from "@/components/layouts/app/Layout"
import { useAccount } from "wagmi"
import { isAddress } from "ethers/lib/utils"

const Page = () => {
  const router = useRouter()
  const { address } = router.query
  const { address: connectedAddress } = useAccount()
  const [isMe, setIsMe] = useState<boolean>(false)

  useEffect(() => {
    if (address === connectedAddress) {
      setIsMe(true)
    } else {
      setIsMe(false)
    }
  }, [connectedAddress, address])

  if (!isAddress(address as string)) {
    return <p>Not a valid account</p>
  }

  return (
    <>
      <p>Query address: {address}</p>
      <p>Connected: {connectedAddress}</p>
      {isMe && <p>it &apos;s me!</p>}
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>
}

export default Page
