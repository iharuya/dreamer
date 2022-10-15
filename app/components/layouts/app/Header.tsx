import Link from "next/link"
import { useAccount } from "wagmi"
import { ConnectKitButton } from "connectkit"
import { APP_NAME } from "@/constants/config"

const Header = () => {
  const { address: connectedAddress, isConnected } = useAccount()

  return (
    <>
      <header className="bg-white fixed w-full border-b-2">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center py-2 justify-start space-x-10">
            <div className="flex flex-1">
              <Link href="/app">
                <a className="text-2xl font-bold text-pink-500">{APP_NAME}</a>
              </Link>
            </div>
            <nav className="items-center justify-end flex flex-1 space-x-4">
              {isConnected && (
                <Link href={`/app/account/${connectedAddress}`}>
                  <a className="font-medium text-gray-600 hover:text-gray-900">
                    マイアカウント
                  </a>
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
export default Header