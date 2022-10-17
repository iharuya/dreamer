import type { NextPage } from "next"
import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

const Page: NextPage = () => {
  const { data: session, status } = useSession()
  const { address: connectedAddress } = useAccount()

  return (
    <>
      <p>環境：{process.env.NODE_ENV}</p>
      <p>接続アドレス：{connectedAddress}</p>
      <div className="my-3">
        <p>{status}</p>
        <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </div>
    </>
  )
}

export default Page
