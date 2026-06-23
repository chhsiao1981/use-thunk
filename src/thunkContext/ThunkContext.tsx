import { type JSX, type ReactNode, useMemo, useState } from 'react'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'

type Props = {
  modules?: string[]
  children?: ReactNode
}

const ThunkContext = (props: Props): JSX.Element => {
  const { modules: propsModules, children } = props
  const modules = propsModules || THUNK_CONTEXT_MAP.theList
  // 0. if there is no Thunk modules (no createThunk): return children.
  if (modules.length === 0) {
    return children as JSX.Element
  }

  // render the 0th module.
  const theModule = modules[0]

  // 1. get the context and moduleState from context map.
  const { context: Context_m, refModuleState } = THUNK_CONTEXT_MAP.theMap[theModule]

  // 2. setup moduleState.
  // biome-ignore lint/correctness/useHookAtTopLevel: the order is fixed.
  const [moduleState, setModuleState] = useState(refModuleState.current)
  refModuleState.current = moduleState

  // 3. value reset only if moduleState is changed.
  // biome-ignore lint/correctness/useHookAtTopLevel: the order is fixed.
  const value = useMemo(
    () => ({
      refModuleState: refModuleState,
      setModuleState: setModuleState,
    }),
    [moduleState],
  )

  // 4. get theChildren
  const theChildren =
    modules.length === 1 ? children : ThunkContext({ modules: modules.slice(1), children })

  // 5. return context.
  return <Context_m.Provider value={value}>{theChildren}</Context_m.Provider>
}

export default ThunkContext
