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
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import Avatar from "@/components/common/Avatar"
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
const { chains, provider } = configureChains(appChains, appProviders)
const { connectors } = getDefaultWallets({
  appName: "Dreamer",
  chains: appChains,
})
const client = createClient({
  autoConnect: false, // if true, nextjs dev server pops up error for hydration mismatch
  connectors,
  provider,
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
        <meta name="description" content="ヒトと機械が紡ぐユメ" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <WagmiConfig client={client}>
        <RainbowKitProvider
          chains={chains}
          modalSize="compact"
          avatar={Avatar}
          showRecentTransactions
        >
          <SessionProvider session={pageProps.session}>
            <SWRConfig
              value={{
                fetcher: defaultFetcher,
              }}
            >
              <BaseLayout>{getLayout(<Component {...pageProps} />)}</BaseLayout>
            </SWRConfig>
          </SessionProvider>
        </RainbowKitProvider>
      </WagmiConfig>
      <ToastContainer position="bottom-right" draggable />
    </>
  )
}

export default App
