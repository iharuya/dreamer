// import { LScale } from "@/components/common/Loading"
// import { Dream } from "@prisma/client"
// import axios from "axios"
// import Error from "next/error"
// import { FC } from "react"
// import useSWR from "swr"
// import DraftCard from "@/components/dream/draft/ViewCard"

// const draftsFetcher = (address: string) =>
//   axios
//     .get("/api/dreams/draft", { params: { dreamerAddress: address } })
//     .then((res) => res.data)
// type Props = {
//   address: string
// }
// const Component: FC<Props> = ({ address }) => {
//   const { data: drafts, error: draftsError } = useSWR<Dream[]>(
//     address,
//     draftsFetcher
//   )

//   if (draftsError) {
//     console.error(draftsError)
//     return <Error statusCode={draftsError?.response?.status || 500} />
//   }

//   return (
//     <>
//       <h1 className="text-4xl font-bold mb-4">ドラフトの管理</h1>
//       {drafts === undefined ? (
//         <LScale message="ドラフトをロード中..." />
//       ) : drafts.length > 0 ? (
//         <div className="flex flex-col space-y-4">
//           {drafts.map((draft) => (
//             <DraftCard key={draft.id} draft={draft} />
//           ))}
//         </div>
//       ) : (
//         <div className="flex flex-col justify-center items-center h-36 space-y-4 text-base-content/60">
//           <span className="text-2xl font-bold">ドラフトをつくろう</span>
//           {/* Todo: 新しく作るボタン（作成モーダルのglobal state化） */}
//           <span>右下のペンマークから</span>
//         </div>
//       )}
//     </>
//   )
// }

// export default Component
