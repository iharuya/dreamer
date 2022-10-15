import type { NextPage } from "next"
import type { AppProps } from "next/app"
import type { ReactElement, ReactNode } from "react"
import Head from "next/head"
import "@/styles/globals.css"
import { APP_NAME } from "@/constants/config"

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  /* eslint no-unused-vars: "off" */
  getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content="最強のWAIFUを生み出そう" />
        <link rel="icon" href="/logo.png" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}
export default MyApp