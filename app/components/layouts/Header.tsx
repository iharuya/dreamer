import Link from "next/link"
import { APP_NAME, AVATAR_COLORS } from "@/constants/config"
import type { FC } from "react"
import { ConnectKitButton } from "connectkit"
import Avatar from "boring-avatars"
import { useNetwork } from "wagmi"

const Component: FC = () => {
  const { chain } = useNetwork()

  return (
    <>
      <header className="w-full fixed bg-base-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex py-2 items-center space-x-4">
            <div className="flex">
              <Link href="/">
                <a className="text-2xl font-bold text-primary whitespace-nowrap">
                  {APP_NAME}
                </a>
              </Link>
            </div>
            <div className="w-full items-center justify-end flex space-x-4">
              <ConnectKitButton.Custom>
                {({ isConnected, show, address, ensName }) => {
                  return (
                    <div className="flex items-center">
                      {isConnected ? (
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0}>
                            <Avatar
                              name={address}
                              variant="beam"
                              colors={AVATAR_COLORS}
                            />
                          </label>
                          <div
                            tabIndex={0}
                            className="dropdown-content shadow w-64 rounded-box bg-base-100"
                          >
                            <div className="flex flex-col text-start p-4">
                              <span>{chain?.unsupported ? "チェーンを変更してください" : `${chain?.name}に接続中`}</span>
                              <h3 className="text-sm truncate">
                                {ensName || address}
                              </h3>
                            </div>
                            <hr className="bg-base-200" />
                            <ul className="menu menu-compact">
                              <li>
                                <Link href={`/accounts/${address}`}>
                                  アカウント
                                </Link>
                              </li>
                              <li>
                                <button onClick={show}>ウォレット設定</button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <button onClick={show} className="btn btn-primary">
                          接続
                        </button>
                      )}
                    </div>
                  )
                }}
              </ConnectKitButton.Custom>
            </div>
          </div>
        </div>
      </header>
      <div style={{ height: "64px" }}></div>
    </>
  )
}
export default Component
