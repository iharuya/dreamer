import { useSession } from "next-auth/react"
import { isAddress } from "ethers/lib/utils"
import type { GetServerSideProps, NextPage } from "next"
import { RESTError } from "@/lib/error"
import axios from "axios"
import { useState } from "react"

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

  const [name, setName] = useState<string>(account.name || "")

  const update = async () => {
    axios
      .patch(`/api/accounts/${account.address}`, { name })
      .then((res) => {
        console.log(res)
      })
      .catch((e) => {
        console.error(e)
      })
  }
  return (
    <>
      <p>account info</p>
      <pre>
        <code>{JSON.stringify(account, null, 2)}</code>
      </pre>

      {isMe && (
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="名前を入力"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn" onClick={update}>
              送信
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Page
