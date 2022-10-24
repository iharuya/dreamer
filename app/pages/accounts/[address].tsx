import { useSession } from "next-auth/react"
import type { NextPage } from "next"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useState } from "react"
import Avatar from "boring-avatars"
import { AVATAR_COLORS } from "@/constants/config"
import { toast } from "react-toastify"
import clsx from "clsx"
import type { Account } from "@prisma/client"
import useSWR, { useSWRConfig } from "swr"
import { useRouter } from "next/router"
import Error from "next/error"
import { LScale } from "@/components/common/Loading"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { patch as patchSchema } from "schema/accounts"
import { z } from "zod"
const schema = patchSchema.shape.body
type Schema = z.infer<typeof schema>

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const Page: NextPage = () => {
  const router = useRouter()
  const queryAddress = router.query.address as string // for sure?
  const { data: session } = useSession()
  const { mutate } = useSWRConfig()
  const { data: account, error: accountError } = useSWR<Account, AxiosError>(
    `/api/accounts/${queryAddress}`,
    fetcher
  )
  const [configModal, setConfigModal] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  if (!account && !accountError) return <LScale message="Loading account..." />
  if (!account) {
    console.error(accountError)
    return <Error statusCode={accountError?.response?.status || 500} />
  }
  const isMe = account.address === session?.address

  const updateAccount = async (data: Schema) => {
    axios
      .patch(`/api/accounts/${account.address}`, data)
      .then(() => {
        mutate(`/api/accounts/${account.address}`)
        toast.info("アカウントを更新しました")
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
          <h3 className="font-bold text-2xl mb-4">アカウント設定</h3>
          <form onSubmit={handleSubmit(updateAccount)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">名前</span>
              </label>
              <input
                type="text"
                placeholder="名前を入力"
                className={clsx(
                  "input input-bordered",
                  formErrors.name?.message && "input-error"
                )}
                defaultValue={account.name || ""}
                {...register("name")}
              />
              {formErrors.name?.message && (
                <label className="label">
                  <span className="label-text text-error">
                    {formErrors.name?.message}
                  </span>
                </label>
              )}
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setConfigModal(false)}
              >
                キャンセル
              </button>
              <button type="submit" className="btn btn-primary">
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Page
