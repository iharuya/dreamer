import { alchemy } from "@/lib/alchemy"

export const getBlockNumber = async () => {
  return alchemy.core.getBlockNumber()
}
