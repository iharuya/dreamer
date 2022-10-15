import { APP_NAME } from "@/constants/config"
import Head from "next/head"
import Header from "@/components/layouts/Header"
import "@/styles/globals.css"
import type { AppProps } from "next/app"

import colors from "tailwindcss/colors"

import { WagmiConfig, createClient, configureChains, chain } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { ConnectKitProvider } from "connectkit"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

const appChains = [chain.polygonMumbai, chain.hardhat]
if (process.env.NODE_ENV == "development") {
  appChains.reverse()
}
const appProviders = [
  alchemyProvider({ priority: 0 }),
  jsonRpcProvider({
    rpc: (currentChain) => {
      if (currentChain.id !== chain.hardhat.id) return null
      return { http: "http://localhost:8546" }
    },
    priority: 1,
  }),
  publicProvider({ priority: 2 }),
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
          `埋め込み (${typeof detectedName === "string"
            ? detectedName
            : detectedName.join(", ")
          })`,
      },
    }),
  ],
  provider,
  webSocketProvider,
})


const App = ({ Component, pageProps }: AppProps<{session: Session}>) => {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content="最強のWAIFUを生み出そう" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <WagmiConfig client={client}>
        <ConnectKitProvider
          customTheme={{
            "--ck-connectbutton-color": "#ffffff",
            "--ck-connectbutton-background": colors.pink[500],
            "--ck-connectbutton-hover-color": "#ffffff",
            "--ck-connectbutton-hover-background": colors.pink[600],
            "--ck-border-radius": 8,
          }}
        >
          <SessionProvider session={pageProps.session}>
            <div className="min-h-screen">
              <Header />
              <main className="bg-white">
                <div className="mx-auto max-w-7xl px-4">
                  <Component {...pageProps} />
                </div>
              </main>
            </div>
          </SessionProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  )
}
export default App