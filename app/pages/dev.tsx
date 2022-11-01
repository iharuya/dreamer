import { GetStaticProps, NextPage } from "next"
import { useSession } from "next-auth/react"
import { useAccount, useBlockNumber } from "wagmi"
import { ADDRESS as ADDRESS_DREAMS } from "@/constants/contracts/dreams"

const Page: NextPage = () => {
  const { data: session, status } = useSession()
  const { address: connectedAddress } = useAccount()
  const { data: blockNumber } = useBlockNumber()

  return (
    <div className="space-y-4">
      <p>Env：{process.env.NODE_ENV}</p>
      <div>
        <p>Connected address：{connectedAddress}</p>
        <p>Block number: {blockNumber}</p>
        <a
          className="link link-primary"
          href={`https://mumbai.polygonscan.com/address/${ADDRESS_DREAMS}`}
          target="_blank"
          rel="noreferrer"
        >
          Dreams contract (polygonscan mumbai)
        </a>
      </div>
      <div>
        <p>Session: {status}</p>
        {session && (
          <pre>
            <code>{JSON.stringify(session, null, 2)}</code>
          </pre>
        )}
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV !== "development") {
    return {
      notFound: true,
    }
  }
  return {
    props: {},
  }
}

export default Page
