import { type ReactNode, useMemo, useState } from 'react'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'

type Props = {
  classes?: string[]
  children?: ReactNode
}

const ThunkContext = (props: Props): ReactNode => {
  const { classes: propsClasses, children } = props
  const classes = propsClasses || THUNK_CONTEXT_MAP.theList
  // 0. if there is no Thunk classes (no registerThunk): return children.
  if (classes.length === 0) {
    return children
  }

  // render the 0th class.
  const theClass = classes[0]

  // 1. get the context and classState from context map.
  const { context: Context_m, refClassState } = THUNK_CONTEXT_MAP.theMap[theClass]

  // 2. setup classState.
  // biome-ignore lint/correctness/useHookAtTopLevel: the order is fixed.
  const [classState, setClassState] = useState(refClassState.current)
  refClassState.current = classState

  // 3. value reset only if classState is changed.
  // biome-ignore lint/correctness/useHookAtTopLevel: the order is fixed.
  const value = useMemo(
    () => ({
      refClassState,
      setClassState,
    }),
    [classState],
  )

  // 4. get theChildren
  const theChildren =
    classes.length === 1 ? children : ThunkContext({ classes: classes.slice(1), children })

  // 5. return context.
  return <Context_m.Provider value={value}>{theChildren}</Context_m.Provider>
}

export default ThunkContext
