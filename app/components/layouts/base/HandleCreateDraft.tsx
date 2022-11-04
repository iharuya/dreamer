import { FC, useContext } from "react"
import { MdEdit } from "react-icons/md"
import CreateDraftModal from "@/components/dream/draft/CreateModal"
import { CreateDraftCtx } from "@/lib/contexts/CreateDraft"

type Props = {
  myAddress: string
}
const Component: FC<Props> = ({ myAddress }) => {
  const { state, dispatch } = useContext(CreateDraftCtx)
  return (
    <>
      <div className="fixed bottom-4 right-4 md:right-8">
        <button
          className="btn btn-circle btn-lg btn-primary shadow-lg"
          onClick={() => dispatch({ type: "open" })}
        >
          <MdEdit className="text-4xl" />
        </button>
      </div>
      {state.isOpen && (
        <CreateDraftModal
          dreamerAddress={myAddress}
          parentId={state.parentId}
          close={() => dispatch({ type: "close" })}
        />
      )}
    </>
  )
}

export default Component
