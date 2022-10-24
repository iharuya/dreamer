import { useSession } from "next-auth/react"
import type { NextPage } from "next"
import axios, { AxiosError } from "axios"
import { useState } from "react"
import Avatar from "boring-avatars"
import { AVATAR_COLORS } from "@/constants/config"
import type { Account } from "@prisma/client"
import useSWR from "swr"
import { useRouter } from "next/router"
import Error from "next/error"
import { LScale } from "@/components/common/Loading"
import Config from "@/components/accounts/Config"

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const Page: NextPage = () => {
  const router = useRouter()
  const queryAddress = router.query.address as string | undefined
  const { data: session } = useSession()
  const { data: account, error: accountError } = useSWR<Account, AxiosError>(
    queryAddress ? `/api/accounts/${queryAddress}` : null,
    fetcher
  )
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false)

  if (!account && !accountError) return <LScale message="Loading account..." />
  if (!account) {
    console.error(accountError)
    return <Error statusCode={accountError?.response?.status || 500} />
  }
  const isMe = account.address === session?.address

  return (
    <>
      <div className="py-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
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
                onClick={() => setIsConfigOpen(true)}
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

      {isConfigOpen && (
        <Config
          account={account}
          close={() => {
            setIsConfigOpen(false)
          }}
        />
      )}
    </>
  )
}

export default Page
