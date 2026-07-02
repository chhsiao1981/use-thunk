//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { useCallback, useSyncExternalStore } from 'react'
import { upsert } from '../defaultThunkFuncs'
import { defaultReducer } from '../reducer'
import { getStateByModule, getStateOrNullByModule, type State } from '../states'
import type { StateAndDefaultState } from '../states/types'
import type { dispatch, get, getModuleState, getOrNull, set } from '../thunk'
import { getMod } from '../thunkContext'

/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * setter (dispatcher) supports thunks.
 */
export default <S extends State>(moduleName: string, id: string): [StateAndDefaultState<S>, set<S>] => {
  const moduleState = getMod<S>(moduleName)

  const subscribe = moduleState.subscribes[id]

  const stateAndDefaultState = useSyncExternalStore(subscribe.subscribe, subscribe.getSnapshot)

  // we cannot move this out because:
  // 1. getModuleState is actually dependent on moduleName.
  // 2. getOrNull and get dependes on getModuleState.
  // 3. setModuleState is actually dependent on setRefModuleState.
  // 4. set and dispatch depends on setModuleState.

  // always use getModuleState to get the current moduleState.
  const getModuleState: getModuleState<S> = useCallback(() => {
    return moduleState
  }, [])

  const getOrNull: getOrNull<S> = useCallback((id?: string | null) => {
    const state = getStateOrNullByModule(getModuleState(), id)
    return state
  }, [])

  const get: get<S> = useCallback((id?: string | null) => {
    const state = getStateByModule(getModuleState(), id)
    return state
  }, [])

  const dispatch: dispatch<S> = useCallback((action) => {
    if (typeof action === 'function') {
      // action is Thunk<S, A>
      action(set, get, getOrNull, dispatch, getModuleState)
      return
    }

    // action is not function. so action is BaseAction
    // we still need to do module-wise reducer because we have init and remove and.
    const { id } = action
    const moduleState = getModuleState()
    const { defaultID: beforeDefaultID } = moduleState
    const subscribe = moduleState.subscribes[id] // before reducer
    defaultReducer(moduleState, action)
    const { defaultID: afterDefaultID, isIDBased } = moduleState

    // check if need to update defaultState
    const isToUpdateDefaultState =
      !isIDBased && (beforeDefaultID !== afterDefaultID || id === afterDefaultID)

    if (isToUpdateDefaultState) {
      const defaultState = getStateOrNullByModule(moduleState) as S | null
      for (const [_, eachNode] of Object.entries(moduleState.nodes)) {
        const { state } = eachNode.stateAndDefaultState
        eachNode.stateAndDefaultState = { state, defaultState }
      }
    }

    // subscribe may be deleted because of remove.
    subscribe?.emitChange(subscribe.listeners)

    if (!isToUpdateDefaultState) {
      return
    }

    for (const [eachID, eachSubscribe] of Object.entries(moduleState.subscribes)) {
      if (eachID === id) {
        continue
      }
      eachSubscribe.emitChange(eachSubscribe.listeners)
    }
  }, [])

  const set: set<S> = useCallback((actionOrID, data) => {
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
  }, [])

  return [stateAndDefaultState, set]
}
