import { type ReactNode, useCallback, useMemo, useState } from 'react'
import type { ActionFunc } from './action'
import { contextMap } from './contextMap'
import type { DispatchFuncMap } from './dispatchFuncMap'
import type { ClassState } from './stateTypes'
import type { ThunkType } from './thunkTypes'

export default (children: ReactNode) => {
  return recursiveRender(contextMap.theList, children)
}

const recursiveRender = (theClassNames: string[], children: ReactNode): ReactNode => {
  if (theClassNames.length === 0) {
    return children
  }

  const theClassName = theClassNames[0]

  console.debug('recursiveRender: theClassName:', theClassName)

  const { context, reducer, theDo } = contextMap.theMap[theClassName]

  // biome-ignore lint/correctness/useHookAtTopLevel: Thunk
  // biome-ignore lint/suspicious/noExplicitAny: state can be any types in Thunk.
  const [classState, setClassState] = useState<ClassState<any>>({ myClass: theClassName, nodes: {} })

  // biome-ignore lint/correctness/useHookAtTopLevel: Thunk
  const getClassState = useCallback(() => classState, [classState])

  // biome-ignore lint/correctness/useHookAtTopLevel: Thunk
  const dispatchMap = useMemo(() => {
    // biome-ignore lint/suspicious/noExplicitAny: action can be any types.
    const dispatch = (action: any) => {
      if (typeof action === 'function') {
        action(dispatch, getClassState)
        return
      }

      const newClassState = reducer(getClassState(), action)

      setClassState(newClassState)
    }

    return (
      Object.keys(theDo)
        // default and myClass are reserved words.
        // functions starting reduce are included in default and not exported.
        .filter((each) => typeof theDo[each] === 'function')
        // biome-ignore lint/suspicious/noExplicitAny: state can be any types in Thunk.
        .reduce((val: DispatchFuncMap<any, any>, eachAction) => {
          // biome-ignore lint/suspicious/noExplicitAny: state can be any types in Thunk.
          const action: ActionFunc<any> = theDo[eachAction]
          // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
          val[eachAction] = (...params: any[]) => dispatch(action(...params))
          return val
        }, {})
    )
  }, [getClassState, setClassState])

  // biome-ignore lint/suspicious/noExplicitAny: state and action can be any in Thunk.
  const value: ThunkType<any, any> = {
    classState,
    dispatchMap,
  }

  const theRestClassNames = theClassNames.slice(1)
  const theRestResults = recursiveRender(theRestClassNames, children)

  return context.Provider({ children: theRestResults, value })
}
