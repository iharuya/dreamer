import { SiweMessage } from "siwe"
import { useAccount, useSignMessage, useDisconnect } from "wagmi"
import { signIn, signOut, getCsrfToken } from "next-auth/react"
import { FC, ReactNode, useEffect, useState } from "react"
import Header from "./Header"
import { toast } from "react-toastify"
import clsx from "clsx"
import axios, { AxiosError } from "axios"
import { useSWRConfig } from "swr"

const Component: FC<{ children: ReactNode }> = ({ children }) => {
  const { address: connectedAddress, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  // previous authenticated address or undefined
  const [previousAddress, setPreviousAddress] = useState<string | undefined>()
  const [signinModal, setSigninModal] = useState<boolean>(false)
  const { mutate } = useSWRConfig()

  /*
  接続状態管理（仮）
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
        await handleSignin(connectedAddress)
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

  const handleSignin = async (address: string | undefined) => {
    if (typeof address === "undefined") return
    const toastId = toast.info("ウォレットで署名してください", {
      autoClose: false,
    })
    try {
      const needToCreateNew = await axios
        .head(`/api/accounts/${address}`)
        .then(() => false)
        .catch((err: AxiosError | Error) => {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            return true
          }
          throw new Error(err.message)
        })
      const now = new Date()
      const expiration = new Date()
      expiration.setHours(now.getHours() + 1)
      const message = new SiweMessage({
        domain: window.location.host,
        address,
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
      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      })
      if (needToCreateNew) {
        await createAccount(address)
        mutate(`/api/accounts/${address}`)
      }
      toast.update(toastId, {
        render: needToCreateNew ? "ようこそ" : "おかえりなさい",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000,
      })
      setPreviousAddress(connectedAddress)
      setSigninModal(false)
    } catch (err) {
      console.error(err)
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

  const createAccount = async (address: string) => {
    return await axios
      .post(`/api/accounts`, { address })
      .then((res) => res.data)
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main style={{ minHeight: "1000px" }}>
        <div className="max-w-5xl mx-auto px-4">{children}</div>
        <div className={clsx("modal", signinModal && "modal-open")}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">サインインしてください</h3>
            <p className="py-4">
              サインインにはウォレットで署名する必要があります
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => disconnect()}>
                キャンセル
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleSignin(connectedAddress)}
              >
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
