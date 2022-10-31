import { ethers } from "ethers"
import { Alchemy, Network } from "alchemy-sdk"

export const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_APIKEY_MUMBAI,
  network: Network.MATIC_MUMBAI,
})
export const provider = new ethers.providers.AlchemyProvider(
  "maticmum",
  process.env.ALCHEMY_APIKEY_MUMBAI
)
