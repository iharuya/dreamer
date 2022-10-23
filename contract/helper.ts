import "dotenv/config"

interface NetworkConfig {
  confirmations?: number
  verify?: boolean
}
interface NetworksConfig {
  [networkName: string]: NetworkConfig | undefined
}
export const networksConfig: NetworksConfig = {
  mumbai: {
    confirmations: 6,
    verify: process.env.POLYGONSCAN_APIKEY ? true : false,
  },
}
