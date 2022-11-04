import { FC, useContext } from "react"
import { BiRefresh } from "react-icons/bi"
import { Get as DreamGet } from "@/api/dreams/[id]"
import { useMyAccount } from "@/lib/hooks/useMyAccount"
import clsx from "clsx"
import { CreateDraftCtx } from "@/lib/contexts/CreateDraft"

type Props = {
  dream: DreamGet
}
const Component: FC<Props> = ({ dream }) => {
  const { data: myAccount } = useMyAccount()
  const { dispatch } = useContext(CreateDraftCtx)

  const handleRedreem = () => {
    if (!myAccount) {
      return
    }
    dispatch({ type: "open", payload: { parentId: dream.id } })
  }

  return (
    <>
      <button
        className={clsx("btn btn-primary flex", !myAccount && "hidden")}
        onClick={handleRedreem}
      >
        <BiRefresh className="text-3xl" />
        <span className="hidden md:inline">リドリーム</span>
        <span className="ml-1 md:ml-2 text-xl font-bold">
          {dream.children.length}
        </span>
      </button>
    </>
  )
}

export default Component
