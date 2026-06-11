//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { useCallback, useContext } from 'react'
import type BaseAction from './action/baseAction'
import type { Reducer } from './reducer'
import type { set } from './set'
import type { ModuleState, State } from './stateTypes'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'

/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * setter (dispatcher) supports thunks.
 */
export default <S extends State>(reducer: Reducer<S>, moduleName: string): [ModuleState<S>, set<S>] => {
  const { context } = THUNK_CONTEXT_MAP.theMap[moduleName]

  const { refModuleState, setModuleState: setModuleState_c } = useContext(context)
  const getModuleState = useCallback(() => {
    return refModuleState.current
  }, [refModuleState])

  const setModuleState = useCallback(
    (newModuleState: ModuleState<S>) => {
      refModuleState.current = newModuleState
      setModuleState_c(newModuleState)
    },
    [refModuleState, setModuleState_c],
  )

  // 5. reducer.
  const reduce = useCallback(
    (action: BaseAction): ModuleState<S> => {
      const moduleState = getModuleState()
      const newModuleState = reducer(moduleState, action)
      return newModuleState
    },
    [reducer, getModuleState],
  )

  // augmented setter.
  const set: set<S> = useCallback(
    (action) => {
      if (typeof action === 'function') {
        // action is Thunk<S, A>
        action(set, getModuleState)
        return
      }

      // action is not function. so action is BaseAction
      const newModuleState = reduce(action)
      setModuleState(newModuleState)
    },
    [getModuleState, setModuleState, reduce],
  )

  return [refModuleState.current, set]
}
