import Link from "next/link"
import { APP_NAME } from "@/constants/config"
import { FC } from "react"
import { ConnectKitButton } from "connectkit"
import HeaderMenu from "./HeaderMenu"

const Component: FC = () => {
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
              <Link href="/stats">Stats</Link>
              <ConnectKitButton.Custom>
                {({ show, address, ensName }) => {
                  return (
                    <HeaderMenu
                      show={show}
                      connectedAddress={address}
                      ensName={ensName}
                    />
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
