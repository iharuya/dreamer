import { FC } from "react"
import Avatar from "@/components/common/Avatar"
import Link from "next/link"
import Image from "next/image"
import { Account } from "@prisma/client"

type Props = {
  dreamId: number
  dreamTitle: string
  imageFilename: string
  dreamer: Account
}
const Component: FC<Props> = ({
  dreamId,
  dreamTitle,
  imageFilename,
  dreamer,
}) => {
  return (
    <div className="card rounded-none md:rounded-lg md:border md:shadow-sm">
      <figure className="overflow-hidden">
        <Link href={`/dreams/${dreamId}`}>
          <a className="flex">
            <Image
              src={`/seed-images/${imageFilename}`}
              alt={dreamTitle}
              className="md:hover:scale-110 transition-all duration-300"
              width="512px"
              height="512px"
            />
          </a>
        </Link>
      </figure>
      <div className="card-body hidden md:block p-2">
        <h2 className="font-bold truncate mb-1 hover:opacity-60">
          <Link href={`/dreams/${dreamId}`}>
            <a>{dreamTitle}</a>
          </Link>
        </h2>
        <Link href={`/accounts/${dreamer.address}/home`}>
          <a className="inline-flex items-center w-full hover:opacity-60">
            <span className="mr-1">
              <Avatar size={28} address={dreamer.address} />
            </span>
            <span className="text-base-content/90 truncate">
              {dreamer.name || "ななしさん"}
            </span>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Component
