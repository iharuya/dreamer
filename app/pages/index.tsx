import { APP_NAME } from "@/constants/config"
import type { NextPage } from "next"
import Link from "next/link"

const Page: NextPage = () => {
  return (
    <div className="flex flex-col space-y-6 items-center justify-center h-screen">
      <h1 className="text-6xl text-pink-500 font-bold">{APP_NAME}</h1>
      <Link href="/app">
        <a className="bg-pink-500 py-4 px-8 text-xl text-white rounded-lg hover:bg-pink-600">
          アプリを起動
        </a>
      </Link>
    </div>
  )
}
export default Page
