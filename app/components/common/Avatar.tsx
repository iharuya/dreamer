import { AvatarComponent } from "@rainbow-me/rainbowkit"
import Avatar from "boring-avatars"
import { AVATAR_COLORS } from "@/constants/config"

export const Component: AvatarComponent = ({ address, size }) => {
  return (
    <Avatar size={size} name={address} variant="beam" colors={AVATAR_COLORS} />
  )
}
export default Component
