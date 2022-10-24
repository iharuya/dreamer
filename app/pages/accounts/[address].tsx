import { useSession } from "next-auth/react"
import type { NextPage } from "next"
import axios, { AxiosError } from "axios"
import { useState } from "react"
import type { Account } from "@prisma/client"
import useSWR from "swr"
import { useRouter } from "next/router"
import Error from "next/error"
import { LScale } from "@/components/common/Loading"
import Info from "@/components/accounts/account/Info"
import Config from "@/components/accounts/account/Config"

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
      <Info
        account={account}
        isMe={isMe}
        openConfig={() => setIsConfigOpen(true)}
      />

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
