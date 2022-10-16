import type { NextPage } from "next"
import { useAccount } from "wagmi"
import { useSession, signIn, signOut } from "next-auth/react"

const Page: NextPage = () => {
  const { address: connectedAddress } = useAccount()
  const { data: session, status } = useSession()

  return (
    <>
      <p>{process.env.NODE_ENV}</p>
      <p>{connectedAddress}</p>
      {status === "authenticated" ? (
        <div>
          <p>こんにちは、{session.user?.email}</p>
          <button onClick={() => signOut()} className="btn btn-outline">
            ログアウト
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => signIn()} className="btn btn-primary">
            ログイン
          </button>
        </div>
      )}
    </>
  )
}

export default Page
