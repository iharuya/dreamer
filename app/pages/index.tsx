import type { NextPage } from "next"
import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react"
import { useAccount, useNetwork, useSignMessage } from "wagmi"
import { SiweMessage } from "siwe"

const Page: NextPage = () => {
  const { data: session, status } = useSession()
  const { address: connectedAddress, isConnected } = useAccount()
  const { chain: connectedChain } = useNetwork()
  const { signMessageAsync } = useSignMessage()

  const handleLogin = async () => {
    try {
      const now = new Date()
      const expiration = new Date()
      expiration.setHours(now.getHours() + 1)
      const message = new SiweMessage({
        domain: window.location.host,
        address: connectedAddress,
        statement: "ウォレットでサインインします",
        uri: window.location.origin,
        version: "1",
        chainId: connectedChain?.id,
        nonce: await getCsrfToken(),
        issuedAt: now.toISOString(),
        expirationTime: expiration.toISOString(),
      })
      const humanMessage = message.prepareMessage()
      const signature = await signMessageAsync({ message: humanMessage })
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      })
    } catch (error) {
      window.alert(error)
    }
  }

  return (
    <>
      <p>環境：{process.env.NODE_ENV}</p>
      <p>接続アドレス：{connectedAddress}</p>
      <div className="my-3">
        {status === "authenticated" ? (
          <>
            <p>ログイン中</p>
            <pre>
              <code>{JSON.stringify(session, null, 2)}</code>
            </pre>
            <button
              onClick={() => signOut({ redirect: false })}
              className="btn btn-outline"
            >
              サインアウト
            </button>
          </>
        ) : (
          <>
            {isConnected ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleLogin()
                }}
                className="btn"
              >
                ウォレットでサインイン
              </button>
            ) : (
              <p>ウォレットを接続してください</p>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Page
