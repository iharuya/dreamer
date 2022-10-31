import { APP_NAME } from "@/constants/config"
import Head from "next/head"
import "@/styles/globals.css"
import { AppProps } from "next/app"
import BaseLayout from "@/components/layouts/base/Layout"
import { ReactElement, ReactNode } from "react"
import { NextPage } from "next"
import { WagmiConfig, createClient, configureChains, chain } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { ConnectKitProvider } from "connectkit"
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"
import { SWRConfig } from "swr"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { defaultFetcher } from "@/lib/fetchers"

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout<P, IP = P> = AppProps<P> & {
  Component: NextPageWithLayout<P, IP>
}

const appChains = [chain.polygonMumbai]
const appProviders = [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_APIKEY_MUMBAI }),
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

const App = ({
  Component,
  pageProps,
}: AppPropsWithLayout<{ session: Session }>) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content="ヒトとAIが紡ぐユメ" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <SessionProvider session={pageProps.session}>
            <SWRConfig
              value={{
                fetcher: defaultFetcher,
              }}
            >
              <BaseLayout>{getLayout(<Component {...pageProps} />)}</BaseLayout>
            </SWRConfig>
          </SessionProvider>
        </ConnectKitProvider>
      </WagmiConfig>
      <ToastContainer position="bottom-right" draggable />
    </>
  )
}

export default App
