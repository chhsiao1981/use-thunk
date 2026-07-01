//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { useCallback, useContext } from 'react'
import { upsert } from '../defaultThunkFuncs'
import { defaultReducer } from '../reducer'
import { getStateByModule, getStateOrNullByModule, type RefModuleState, type State } from '../states'
import type { dispatch, get, getModuleState, getOrNull, set } from '../thunk'
import { THUNK_CONTEXT_MAP } from '../thunkContext'

/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * setter (dispatcher) supports thunks.
 */
export default <S extends State>(moduleName: string): [RefModuleState<S>, set<S>] => {
  const { context } = THUNK_CONTEXT_MAP.theMap[moduleName]

  const { refModuleState, setRefModuleState } = useContext(context)

  // always use getModuleState to get the current moduleState.
  const getModuleState: getModuleState<S> = useCallback(() => {
    return refModuleState.current
  }, [refModuleState.current])

  const getOrNull: getOrNull<S> = useCallback(
    (id?: string | null) => {
      const state = getStateOrNullByModule(getModuleState(), id)
      return state
    },
    [getModuleState],
  )

  const get: get<S> = useCallback(
    (id?: string | null) => {
      const state = getStateByModule(getModuleState(), id)
      return state
    },
    [getModuleState],
  )

  const dispatch: dispatch<S> = useCallback(
    (action) => {
      if (typeof action === 'function') {
        // action is Thunk<S, A>
        action(set, get, getOrNull, dispatch, getModuleState)
        return
      }

      const moduleState = getModuleState()

      // action is not function. so action is BaseAction
      const newModuleState = defaultReducer(moduleState, action)

      setRefModuleState({ current: newModuleState })
    },
    [getModuleState],
  )

  const set: set<S> = useCallback(
    (actionOrID, data) => {
      if (typeof actionOrID === 'string' || actionOrID === null || typeof actionOrID === 'undefined') {
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
    [dispatch],
  )

  return [refModuleState, set]
}
