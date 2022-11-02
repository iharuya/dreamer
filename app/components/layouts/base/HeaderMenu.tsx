import { FC } from "react"
import Link from "next/link"
import { AVATAR_COLORS } from "@/constants/config"
import Avatar from "boring-avatars"
import { useNetwork } from "wagmi"
import { useMyAccount } from "@/lib/hooks"

type Props = {
  show?: () => void
  connectedAddress?: string
  ensName?: string
}
const Component: FC<Props> = ({ show, connectedAddress, ensName }) => {
  const { chain } = useNetwork()
  const { data: myAccount } = useMyAccount()

  return (
    <div className="flex items-center">
      {connectedAddress ? (
        <div className="dropdown dropdown-end">
          <label tabIndex={0}>
            <Avatar
              name={connectedAddress}
              variant="beam"
              colors={AVATAR_COLORS}
            />
          </label>
          <div
            tabIndex={0}
            className="dropdown-content shadow w-64 rounded-box bg-base-100"
          >
            <div className="p-4">
              {myAccount ? (
                <div className="flex flex-col">
                  <h3 className="text-lg truncate">
                    {myAccount.name || "ななしさん"}
                  </h3>
                  <span className="text-sm truncate text-base-content/70">
                    {ensName || connectedAddress}
                  </span>
                </div>
              ) : (
                <span className="text-error">サインインしてください</span>
              )}
            </div>
            <hr className="bg-base-200" />
            {myAccount && (
              <>
                <ul className="menu menu-compact">
                  <li>
                    <Link href={`/accounts/${connectedAddress}/home`}>
                      <a>
                        <span>
                          <span>マイページ</span>
                        </span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={`/accounts/${connectedAddress}/drafts`}>
                      <a>
                        <span>
                          <span>ドラフト</span>
                        </span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={`/accounts/${connectedAddress}/tickets`}>
                      <a>
                        <span>
                          <span>チケット</span>
                        </span>
                      </a>
                    </Link>
                  </li>
                </ul>
                <hr className="bg-base-200" />
              </>
            )}
            <div className="flex flex-col p-4 space-y-2">
              <span>
                {chain?.unsupported
                  ? "チェーンを変更してください"
                  : `${chain?.name}に接続中`}
              </span>
              <button onClick={show} className="btn btn-sm">
                ウォレット設定
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={show} className="btn btn-primary">
          接続
        </button>
      )}
    </div>
  )
}
export default Component
