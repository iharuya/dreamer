import { chain } from "wagmi"

export const DREAM_EXPIRATION_BLOCKS = 10 // mumbai: 5s/block

export const BLOCK_TIME = 5 // seconds
/* You (client) have a high probability of success 
  if sends tx by the expiration where expiration - current >= margin */
export const BLOCK_MARGIN = 3

export const SERVER_CHAIN_ID = chain.polygonMumbai.id
