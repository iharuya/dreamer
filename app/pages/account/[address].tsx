import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { isAddress } from "ethers/lib/utils"
import type { NextPage } from "next"

const Page: NextPage = () => {
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

export default Page
