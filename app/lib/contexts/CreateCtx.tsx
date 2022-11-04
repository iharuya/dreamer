// Thanks to https://gist.github.com/sw-yx/f18fe6dd4c43fddb3a4971e80114a052

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  Reducer,
  SetStateAction,
  useReducer,
  useState,
} from "react"

export function createStateCtx<A>(defaultValue: A) {
  type UpdateType = Dispatch<SetStateAction<typeof defaultValue>>
  const defaultUpdate: UpdateType = () => defaultValue
  const ctx = createContext({
    state: defaultValue,
    update: defaultUpdate,
  })

  function Provider(props: PropsWithChildren<{}>) {
    const [state, update] = useState(defaultValue)
    return <ctx.Provider value={{ state, update }} {...props} />
  }
  return [ctx, Provider] as const
}

export function createReducerCtx<StateType, ActionType>(
  reducer: Reducer<StateType, ActionType>,
  initialState: StateType
) {
  const defaultDispatch: Dispatch<ActionType> = () => initialState
  const ctx = createContext({
    state: initialState,
    dispatch: defaultDispatch,
  })
  function Provider(props: PropsWithChildren<{}>) {
    const [state, dispatch] = useReducer<Reducer<StateType, ActionType>>(
      reducer,
      initialState
    )
    return <ctx.Provider value={{ state, dispatch }} {...props} />
  }
  return [ctx, Provider] as const
}
