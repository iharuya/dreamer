import { createReducerCtx } from "./CreateCtx"

type State = {
  isOpen: boolean
  parentId?: number
}
const initialState: State = { isOpen: false, parentId: undefined }
type Action =
  | { type: "open"; payload?: { parentId?: number } }
  | { type: "close" }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "open":
      return { isOpen: true, parentId: action.payload?.parentId }
    case "close":
      return { isOpen: false }
    default:
      throw new Error()
  }
}

export const [CreateDraftCtx, CreateDraftProvider] = createReducerCtx(
  reducer,
  initialState
)
