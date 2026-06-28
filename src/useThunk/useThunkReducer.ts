//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { useCallback, useContext, useMemo } from 'react'
import type { BaseAction } from '../action'
import { upsert } from '../defaultThunkFuncs'
import type { Reducer } from '../reducer'
import { getStateByModule, getStateOrNullByModule, type ModuleState, type State } from '../states'
import type { dispatch, get, getModuleState, getOrNull, set } from '../thunk'
import { THUNK_CONTEXT_MAP } from '../thunkContext'

/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * setter (dispatcher) supports thunks.
 */
export default <S extends State>(reducer: Reducer<S>, moduleName: string): [ModuleState<S>, set<S>] => {
  const { context } = THUNK_CONTEXT_MAP.theMap[moduleName]

  // moduleState_c as the snapshot of the moduleState from the context.
  const { moduleState: moduleState_c, setModuleState: setModuleState_c } = useContext(context)

  // refModuleState is used only internally to sync the moduleState after dispatch.
  const moduleState = useMemo(() => ({ current: moduleState_c }), [moduleState_c])

  // always use getModuleState to get the current moduleState.
  const getModuleState: getModuleState<S> = useCallback(() => {
    return moduleState.current
  }, [moduleState])

  const setModuleState = (newModuleState: ModuleState<S>) => {
    moduleState.current = newModuleState
    setModuleState_c(newModuleState)
  }

  const getOrNull: getOrNull<S> = useCallback(
    (id?: string) => {
      const state = getStateOrNullByModule(getModuleState(), id)
      return state
    },
    [getModuleState],
  )

  const get: get<S> = useCallback(
    (id?: string) => {
      const state = getStateByModule(getModuleState(), id)
      return state
    },
    [getModuleState],
  )

  const reduce = useCallback(
    (action: BaseAction): ModuleState<S> => {
      const newModuleState = reducer(getModuleState(), action)
      return newModuleState
    },
    [getModuleState, reducer],
  )

  const dispatch: dispatch<S> = useCallback(
    (action) => {
      if (typeof action === 'function') {
        // action is Thunk<S, A>
        action(set, get, getOrNull, dispatch, getModuleState)
        return
      }

      // action is not function. so action is BaseAction
      const newModuleState = reduce(action)

      setModuleState(newModuleState)
    },
    [getModuleState, setModuleState_c, reduce],
  )

  const set: set<S> = useCallback(
    (actionOrID, data) => {
      if (typeof actionOrID === 'string') {
        // actionOrID is id
        if (!data) {
          return
        }

        // we have the data, we can do upsert.
        const action = upsert(actionOrID, data)
        dispatch(action)
        return
      }

      // actionOrID is action
      dispatch(actionOrID)
    },
    [dispatch, upsert],
  )

  return [moduleState_c, set] // moduleState_c as the snapshot from the context.
}
