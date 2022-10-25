import { NextPage } from "next"
import { useSession } from "next-auth/react"
import { useAccount, useBlockNumber } from "wagmi"

const Page: NextPage = () => {
  const { data: session, status } = useSession()
  const { address: connectedAddress } = useAccount()
  const { data: blockNumber } = useBlockNumber()

  return (
    <>
      <p>環境：{process.env.NODE_ENV}</p>
      <p>接続アドレス：{connectedAddress}</p>
      <div className="my-3">
        <p>Block number: {blockNumber}</p>
      </div>
      <div className="my-3">
        <p>Session: {status}</p>
        <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </div>
    </>
  )
}

export default Page
