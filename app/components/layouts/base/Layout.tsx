import { SiweMessage } from "siwe"
import { useAccount, useSignMessage, useDisconnect, useNetwork } from "wagmi"
import { signIn, signOut, getCsrfToken, useSession } from "next-auth/react"
import { FC, ReactNode, useEffect, useState } from "react"
import Header from "./Header"
import { toast } from "react-toastify"
import axios, { AxiosError } from "axios"
import ChangeChainModal from "@/components/layouts/base/ChangeChainModal"
import SignInModal from "@/components/layouts/base/SignInModal"
import HandleCreateDraft from "./HandleCreateDraft"
import { useMyAccount } from "@/lib/hooks/useMyAccount"
import { CreateDraftProvider } from "@/lib/contexts/CreateDraft"

const Component: FC<{ children: ReactNode }> = ({ children }) => {
  const { address: connectedAddress } = useAccount()
  const { disconnect } = useDisconnect()
  const { chain: connectedChain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
  const { status: sessionStatus } = useSession()
  // Previously authenticated chain/address
  const [prevChainId, setPrevChainId] = useState<number>()
  const [prevAddress, setPrevAddress] = useState<string>()
  const [changeChainModal, setChangeChainModal] = useState<boolean>(false)
  const [signInModal, setSignInModal] = useState<boolean>(false)
  const { data: myAccount, mutate: mutateMyAccount } = useMyAccount()

  const handleSignIn = async () => {
    if (connectedAddress === undefined || connectedChain === undefined) {
      reset()
      return
    }
    if (connectedChain.id !== prevChainId || connectedAddress !== prevAddress) {
      signOut({ redirect: false })
    }
    if (connectedChain.unsupported) {
      setChangeChainModal(true)
      return
    }

    // Todo: Change in account should popup modal first

    setChangeChainModal(false)
    const success = await trySignIn(connectedAddress, connectedChain.id)
    if (success) {
      setSignInModal(false)
      setPrevAddress(connectedAddress)
      setPrevChainId(connectedChain.id)
    } else {
      setSignInModal(true)
    }
  }

  useEffect(() => {
    handleSignIn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedAddress, connectedChain])

  const trySignIn = async (address: string, chainId: number) => {
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
        statement: "Dreamerにサインインします",
        uri: window.location.origin,
        version: "1",
        chainId: chainId,
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
      toast.dismiss(toastId)
      if (needToCreateNew) {
        await createAccount(address)
        mutateMyAccount()
        toast.success("ようこそ")
      }
      return true
    } catch (err: any) {
      if (err.code === "ACTION_REJECTED") {
        toast.dismiss(toastId)
      } else {
        console.error(err)
        toast.update(toastId, {
          render: "サインインエラー",
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        })
      }
      return false
    }
  }

  const reset = () => {
    if (sessionStatus !== "unauthenticated") {
      signOut({ redirect: false })
    }
    if (connectedAddress !== undefined) {
      disconnect()
    }
    if (changeChainModal) {
      setChangeChainModal(false)
    }
    if (signInModal) {
      setSignInModal(false)
    }
  }

  const createAccount = async (address: string) => {
    return await axios
      .post(`/api/accounts`, { address })
      .then((res) => res.data)
  }

  return (
    <div className="h-screen overflow-y-scroll overflow-x-hidden relative">
      <CreateDraftProvider>
        <Header />
        <main>
          <div className="max-w-5xl mx-auto md:px-4">{children}</div>
        </main>

        {changeChainModal && <ChangeChainModal cancel={() => reset()} />}
        {signInModal && (
          <SignInModal proceed={() => handleSignIn()} cancel={() => reset()} />
        )}

        {myAccount && <HandleCreateDraft myAddress={myAccount.address} />}
      </CreateDraftProvider>
    </div>
  )
}

export default Component
