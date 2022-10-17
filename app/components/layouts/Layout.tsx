import { SiweMessage } from "siwe"
import { useAccount, useSignMessage } from "wagmi"
import { signIn, signOut, getCsrfToken } from "next-auth/react"
import { FC, ReactNode, useEffect, useState } from "react"
import Header from "./Header"
import { toast } from "react-toastify"
import clsx from "clsx"

const Component: FC<{ children: ReactNode }> = ({ children }) => {
  const { address: connectedAddress, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  // previous authenticated address or undefined
  const [previousAddress, setPreviousAddress] = useState<string | undefined>()
  const [signinModal, setSigninModal] = useState<boolean>(false)

  /*
  接続状態
  - ウォレット接続
    - セッション接続（authenticated）
    - unauthenticated
  - ウォレット未接続
    - unauthenticated

  ウォレット未接続の状態から接続したとき->自動で署名をポップアップ
  ウォレットの接続を解除したとき->サインアウト
  リロードしたとき->今は無条件でサインアウト
  アカウントを切り替えたとき->サインアウトして、署名を促すモーダルを出す
  署名をキャンセルもしくは認証に失敗したとき->接続している間は署名を促すモーダルを出す
  ネットワークを変更したとき->今は何もしない
  */
  useEffect(() => {
    ;(async () => {
      if (isConnected && typeof previousAddress === "undefined") {
        console.log("1")
        await handleSignin()
        return
      }
      if (!isConnected) {
        handleSignout()
        return
      }
      if (isConnected && typeof previousAddress !== "undefined") {
        console.assert(connectedAddress !== previousAddress)
        handleSignout()
        setSigninModal(true)
        return
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedAddress])

  useEffect(() => {
    if (!isConnected) {
      setSigninModal(false)
    }
  }, [isConnected])

  const handleSignin = async () => {
    const toastId = toast.info("ウォレットで署名してください", {
      autoClose: false,
    })
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
        // chainId: connectedChain?.id,
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
      setPreviousAddress(connectedAddress)
      setSigninModal(false)
      toast.update(toastId, {
        render: "サインインしました",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000,
      })
    } catch (error) {
      console.error(error)
      // setPreviousAddress(undefined) ?
      setSigninModal(true)
      toast.update(toastId, {
        render: "サインインエラー",
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      })
    }
  }

  const handleSignout = () => {
    signOut({ redirect: false })
    setPreviousAddress(undefined)
    toast.info("サインアウトしました")
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-4">{children}</div>
        <div className={clsx("modal", signinModal && "modal-open")}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">サインインしてください</h3>
            <p className="py-4">
              サインインにはウォレットで署名する必要があります
            </p>
            <div className="modal-action">
              <button className="btn" onClick={handleSignin}>
                サインイン
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Component
