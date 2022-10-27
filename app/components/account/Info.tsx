import { Account } from "@prisma/client"
import { FC } from "react"
import Avatar from "boring-avatars"
import { AVATAR_COLORS } from "@/constants/config"

type Props = {
  account: Account
  isMe: boolean
  openConfig: () => void
}
const Component: FC<Props> = ({ account, isMe, openConfig }) => {
  return (
    <div className="py-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
      <div>
        <Avatar
          size={120}
          name={account.address}
          variant="beam"
          colors={AVATAR_COLORS}
        />
      </div>
      <div className="w-full">
        <div className="flex mb-2 items-center">
          <h1 className="text-4xl">{account.name || "ななしさん"}</h1>
          {isMe && (
            <button className="btn btn-outline ml-auto" onClick={openConfig}>
              編集
            </button>
          )}
        </div>
        <h2 className="text-gray-600 truncate">{account.address}</h2>
        <p className="text-sm text-gray-600" suppressHydrationWarning>
          {/* createdAt is actually ISO string... */}
          {`${new Date(account.createdAt).toLocaleDateString()} にはじめました`}
        </p>
      </div>
    </div>
  )
}
export default Component
