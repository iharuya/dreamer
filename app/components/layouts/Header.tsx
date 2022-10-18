import Link from "next/link"
import { useAccount } from "wagmi"
import { ConnectKitButton } from "connectkit"
import { APP_NAME } from "@/constants/config"
import type { FC } from "react"

const Component: FC = () => {
  const { address: connectedAddress, isConnected } = useAccount()

  return (
    <>
      <header className="fixed w-full border-b-2 border-base-300">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center py-2 justify-start space-x-10">
            <div className="flex flex-1">
              <Link href="/">
                <a className="text-2xl font-bold text-primary">{APP_NAME}</a>
              </Link>
            </div>
            <nav className="items-center justify-end flex flex-1 space-x-4">
              {isConnected && (
                <Link href={`/accounts/${connectedAddress}`}>
                  <a className="font-medium">マイアカウント</a>
                </Link>
              )}
              <ConnectKitButton
                label="ウォレットでログイン"
                showBalance={true}
              />
            </nav>
          </div>
        </div>
      </header>
      <div className="h-20"></div>
    </>
  )
}
export default Component
