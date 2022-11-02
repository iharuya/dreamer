import Link from "next/link"
import { APP_NAME } from "@/constants/config"
import { FC } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import HeaderMenu from "./HeaderMenu"

const Component: FC = () => {
  return (
    <>
      <header className="w-full fixed bg-base-100 z-50">
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
              {process.env.NODE_ENV === "development" && (
                <Link href="/dev">Dev</Link>
              )}
              <ConnectButton.Custom>
                {({ account, openAccountModal, openConnectModal }) => {
                  return (
                    <HeaderMenu
                      openConnectModal={openConnectModal}
                      openAccountModal={openAccountModal}
                      connectedAddress={account?.address}
                    />
                  )
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </header>
      <div style={{ height: "64px" }}></div>
    </>
  )
}
export default Component
