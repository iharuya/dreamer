import { FC } from "react"
import { Get as DreamsGet } from "@/api/dreams/index"
import Avatar from "@/components/common/Avatar"
import Link from "next/link"
import Image from "next/image"

type Props = {
  dream: DreamsGet[number]
  onClick: () => void
}
const Component: FC<Props> = ({ dream, onClick }) => {
  return (
    <div
      className="card rounded-none md:rounded-lg md:border md:shadow-sm"
      onClick={onClick}
    >
      <figure className="overflow-hidden">
        <Link href={`/dreams/${dream.id}`}>
          <a>
            <Image
              src={`/seed-images/${dream.image.filename}`}
              alt={dream.title}
              className="md:hover:scale-110 transition-all duration-300"
              width="512px"
              height="512px"
            />
          </a>
        </Link>
      </figure>
      <div className="card-body hidden md:block p-2">
        <h2 className="font-bold truncate mb-1 hover:opacity-60">
          <Link href={`/dreams/${dream.id}`}>
            <a>{dream.title}</a>
          </Link>
        </h2>
        <Link href={`/accounts/${dream.dreamer.address}/home`}>
          <a className="inline-flex items-center w-full hover:opacity-60">
            <span className="mr-1">
              <Avatar size={28} address={dream.dreamer.address} />
            </span>
            <span className="text-base-content/90 truncate">
              {dream.dreamer.name || "ななしさん"}
            </span>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Component
