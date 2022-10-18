import { useSession } from "next-auth/react"
import { isAddress } from "ethers/lib/utils"
import type { GetServerSideProps, NextPage } from "next"
import { RESTError } from "@/lib/error"

const apiBase = "http://localhost:3000"

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Ethereumのアドレスでない場合は404を返す
  const queryAddress = context.query.address as string
  if (!isAddress(queryAddress)) {
    return {
      notFound: true,
    }
  }

  let account
  let accountRes = await fetch(`${apiBase}/api/accounts/${queryAddress}`)
  if (accountRes.ok) {
    account = await accountRes.json()
  } else if (accountRes.status !== 404) {
    throw new RESTError(accountRes.status, "unknown error")
  } else {
    // if 404 then create new account
    accountRes = await fetch(`${apiBase}/api/accounts`, {
      method: "POST",
      body: JSON.stringify({ address: queryAddress }),
    })
    account = await accountRes.json()
    if (!accountRes.ok) {
      throw new RESTError(accountRes.status, account.message)
    }
  }

  return {
    props: { account },
  }
}

const Page: NextPage<{ account: any }> = ({ account }) => {
  const { data: session, status } = useSession()
  const isMe =
    status === "authenticated" && account.address === session?.address

  return (
    <>
      <pre>
        <code>{JSON.stringify(account, null, 2)}</code>
      </pre>

      {isMe && <p>I have a control in this page</p>}
    </>
  )
}

export default Page
