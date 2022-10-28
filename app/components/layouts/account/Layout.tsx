import { useSession } from "next-auth/react"
import { FC, ReactNode, useEffect, useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/router"
import Error from "next/error"
import { LScale } from "@/components/common/Loading"
import Info from "@/components/account/Info"
import Config from "@/components/account/Config"
import { Account } from "@prisma/client"
import clsx from "clsx"
import Link from "next/link"

const Component: FC<{ children: ReactNode; pageName: string }> = ({
  children,
  pageName,
}) => {
  const router = useRouter()
  const queryAddress = router.query.address as string | undefined
  const { data: session } = useSession()
  const { data: account, error: accountError } = useSWR<Account>(
    queryAddress ? `/api/accounts/${queryAddress}` : null
  )
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false)

  if (account === undefined && !accountError)
    return <LScale message="アカウントをロード中..." />
  if (account === undefined) {
    console.error(accountError)
    return <Error statusCode={accountError?.response?.status || 500} />
  }
  const isMe = account.address === session?.address

  if (!isMe && pageName !== "dreams") {
    // Should use middleware...
    router.push(`/accounts/${account.address}/dreams`)
  }

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

      <ul className="tabs font-bold mt-8">
        <li
          className={clsx(
            "tab tab-bordered md:tab-lg",
            pageName === "dreams" && "tab-active"
          )}
        >
          <Link href={`/accounts/${account.address}/dreams`}>
            <a>ドリーム</a>
          </Link>
        </li>
        {isMe && (
          <>
            <li
              className={clsx(
                "tab tab-bordered md:tab-lg",
                pageName === "drafts" && "tab-active"
              )}
            >
              <Link href={`/accounts/${account.address}/drafts`}>
                <a>ドラフト</a>
              </Link>
            </li>
            <li
              className={clsx(
                "tab tab-bordered md:tab-lg",
                pageName === "tickets" && "tab-active"
              )}
            >
              <Link href={`/accounts/${account.address}/tickets`}>
                <a>チケット</a>
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className="py-6">{children}</div>
    </>
  )
}

export default Component
