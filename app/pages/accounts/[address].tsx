import { useSession } from "next-auth/react"
import { isAddress } from "ethers/lib/utils"
import type { GetServerSideProps, NextPage } from "next"
import axios, { AxiosResponse } from "axios"
import prisma from "@/lib/prismadb"
import { useEffect, useState } from "react"
import Avatar from "boring-avatars"
import { AVATAR_COLORS } from "@/constants/config"
import { toast } from "react-toastify"
import clsx from "clsx"
import type { Account } from "@prisma/client"

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Ethereumのアドレスでない場合は404を返す
  const queryAddress = context.query.address as string
  if (!isAddress(queryAddress)) {
    return {
      notFound: true,
    }
  }
  // Nextjsのapiを叩くのはフロントからのみで、ここでは直接DBを操作する
  const account = await prisma.account.findUnique({
    where: { address: queryAddress },
  })
  if (!account)
    return {
      notFound: true,
    }
  return {
    props: { initialAccount: JSON.parse(JSON.stringify(account)) },
  }
}

const Page: NextPage<{ initialAccount: Account }> = ({ initialAccount }) => {
  const { data: session, status } = useSession()
  const [account, setAccount] = useState<Account>(initialAccount)
  const isMe =
    status === "authenticated" && account.address === session?.address
  const [configModal, setConfigModal] = useState<boolean>(false)
  const [name, setName] = useState<string>(initialAccount.name || "")

  useEffect(() => {
    setAccount(initialAccount)
    setName(initialAccount.name || "")
  }, [initialAccount])

  const update = async () => {
    axios
      .patch(`/api/accounts/${account.address}`, { name })
      .then((res: AxiosResponse<Account>) => {
        setAccount(res.data)
        setConfigModal(false)
      })
      .catch((e) => {
        console.error(e)
        toast.error("更新に失敗しました")
      })
  }

  return (
    <>
      <div className="max-w-5xl mx-auto py-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div>
          <Avatar
            size={120}
            name={account.address}
            variant="beam"
            colors={AVATAR_COLORS}
          />
        </div>
        <div className="w-full">
          <div className="flex mb-2 items-center">
            <h1 className="text-4xl">{account.name || "ななしさん"}</h1>
            {isMe && (
              <button
                className="btn btn-outline ml-auto"
                onClick={() => setConfigModal(true)}
              >
                編集
              </button>
            )}
          </div>
          <h2 className="text-gray-600 truncate">{account.address}</h2>
          <p className="text-sm text-gray-600" suppressHydrationWarning>
            {`${new Date(
              account.created_at
            ).toLocaleDateString()} にはじめました`}
          </p>
        </div>
      </div>

      <div className={clsx("modal", configModal && "modal-open")}>
        <div className="modal-box">
          <h3 className="font-bold text-2xl mb-4">アカウント情報</h3>
          <div className="form-control">
            <input
              type="text"
              placeholder="名前を入力"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => setConfigModal(false)}>
              キャンセル
            </button>
            <button className="btn btn-primary" onClick={update}>
              保存
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
