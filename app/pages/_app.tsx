import { APP_NAME } from "@/constants/config"
import Head from "next/head"
import "@/styles/globals.css"
import Layout from "@/components/layouts/Layout"
import { AppProps } from "next/app"
import { WagmiConfig, createClient, configureChains, chain } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { ConnectKitProvider } from "connectkit"
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"
import { SWRConfig } from "swr"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

const appChains = [chain.polygonMumbai, chain.hardhat]
if (process.env.NODE_ENV == "development") {
  appChains.reverse()
}
const appProviders = [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_APIKEY_MUMBAI }),
  jsonRpcProvider({
    rpc: (currentChain) => {
      if (currentChain.id !== chain.hardhat.id) return null
      return {
        http: `http://localhost:${
          process.env.NEXT_PUBLIC_HARDHAT_PORT || "8545"
        }`,
      }
    },
  }),
  publicProvider(),
]
const { chains, provider, webSocketProvider } = configureChains(
  appChains,
  appProviders
)

const client = createClient({
  autoConnect: false, // if true, nextjs dev server pops up error for hydration mismatch
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `埋め込み (${
            typeof detectedName === "string"
              ? detectedName
              : detectedName.join(", ")
          })`,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

const App = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content="夢広がるヒトとAIと価値のSNS" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <ToastContainer position="bottom-right" draggable />
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <SessionProvider session={pageProps.session}>
            <SWRConfig
              value={{
                fetcher: (url: string) =>
                  axios.get(url).then((res) => res.data),
              }}
            >
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SWRConfig>
          </SessionProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  )
}
export default App
