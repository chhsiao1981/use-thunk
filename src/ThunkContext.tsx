import { type ReactNode, useMemo, useState } from 'react'
import type { ClassState } from './stateTypes'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'

type Props = {
  classes?: string[]
  children?: ReactNode
}
const ThunkContext = (props: Props) => {
  let { classes, children } = props
  if (!classes) {
    classes = THUNK_CONTEXT_MAP.theList
  }
  if (classes.length === 0) {
    return children
  }

  const theClass = classes[0]

  const { context: Context_m, refClassState } = THUNK_CONTEXT_MAP.theMap[theClass]

  // biome-ignore lint/correctness/useHookAtTopLevel: the order is fixed.
  // biome-ignore lint/suspicious/noExplicitAny: This generalized state can be any type.
  const [classState, setClassState] = useState<ClassState<any>>({ myClass: theClass, nodes: {} })

  refClassState.current = classState
  // biome-ignore lint/correctness/useHookAtTopLevel: the order is fixed.
  const value = useMemo(
    () => ({
      refClassState,
      setClassState,
    }),
    [classState],
  )

  const theChildren =
    classes.length === 1 ? children : ThunkContext({ classes: classes.slice(1), children })

  return <Context_m.Provider value={value}>{theChildren}</Context_m.Provider>
}

export default ThunkContext
