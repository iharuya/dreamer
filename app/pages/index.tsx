import type { NextPage } from "next"
import { useAccount } from "wagmi"
import LoginButton from "@/components/LoginButton"

const Page: NextPage = () => {
  const { address: connectedAddress } = useAccount()

  return (
    <>
      <p>{process.env.NODE_ENV}</p>
      <p>{connectedAddress}</p>
      <LoginButton></LoginButton>
    </>
  )
}

export default Page
