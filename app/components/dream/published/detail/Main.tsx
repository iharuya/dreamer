import Image from "next/image"
import Link from "next/link"
import Avatar from "@/components/common/Avatar"
import ReadMore from "@/components/common/ReadMore"
import RedreamButton from "./RedreamButton"
import { Get as DreamGet } from "@/api/dreams/published/[id]"
import { FC } from "react"

type Props = {
  dream: DreamGet
}
const Component: FC<Props> = ({ dream }) => {
  return (
    <>
      <figure className="text-center">
        <Image
          src={`/seed-images/${dream.image.filename}`}
          alt={dream.title}
          width="512px"
          height="512px"
        />
      </figure>
      <div>
        <h1 className="text-xl font-bold py-2">{dream.title}</h1>
        <div className="flex justify-between">
          <Link href={`/accounts/${dream.dreamer.address}/home`}>
            <a className="inline-flex items-center hover:opacity-60 truncate">
              <span className="mr-2">
                <Avatar size={40} address={dream.dreamer.address} />
              </span>
              <span className="text-base-content/90 font-bold text-lg truncate">
                {dream.dreamer.name || "ななしさん"}
              </span>
            </a>
          </Link>
          <RedreamButton dream={dream} />
        </div>

        <div className="py-2">
          <ReadMore defaultHeight={120} className="rounded-lg bg-base-200">
            <div className="p-2">
              <p className="font-medium" suppressHydrationWarning>
                {`${new Date(dream.publishedAt).toLocaleDateString()} に投稿`}
              </p>
              {dream.caption && (
                <div className="whitespace-pre-wrap py-2">{dream.caption}</div>
              )}
            </div>
          </ReadMore>
        </div>

        <div className="py-2">
          <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg">
            <input type="checkbox" />
            <div className="collapse-title">プロンプトを見る</div>
            <div className="collapse-content text-base-content/80">
              <p>{dream.prompt}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Component
