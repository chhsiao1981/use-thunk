//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { useCallback, useContext } from 'react'
import type { BaseAction } from '../action'
import { upsert } from '../defaultThunkFuncs/upsert'
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

  const { refModuleState, setModuleState: setModuleState_c } = useContext(context)
  const getModuleState: getModuleState<S> = useCallback(() => {
    return refModuleState.current
  }, [refModuleState]) as () => ModuleState<S>

  const setModuleState = useCallback(
    (newModuleState: ModuleState<S>) => {
      refModuleState.current = newModuleState
      setModuleState_c(newModuleState)
    },
    [refModuleState, setModuleState_c],
  )

  const getOrNull: getOrNull<S> = useCallback(
    (id?: string) => {
      const moduleState = getModuleState()
      const state = getStateOrNullByModule(moduleState, id)
      return state
    },
    [getModuleState],
  )

  const get: get<S> = useCallback(
    (id?: string) => {
      const moduleState = getModuleState()
      const state = getStateByModule(moduleState, id)
      return state
    },
    [getModuleState],
  )

  const reduce = useCallback(
    (action: BaseAction): ModuleState<S> => {
      const moduleState = getModuleState()
      const newModuleState = reducer(moduleState, action)
      return newModuleState
    },
    [reducer, getModuleState],
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
    [getModuleState, setModuleState, reduce],
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
        const newModuleState = reduce(action)
        setModuleState(newModuleState)
        return
      }

      // actionOrID is action
      dispatch(actionOrID)
    },
    [getModuleState, setModuleState, reduce],
  )

  return [refModuleState.current, set]
}
