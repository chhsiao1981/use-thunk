//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { useCallback, useContext } from 'react'
import type BaseAction from './action/baseAction'
import type { Reducer } from './reducer'
import type { set } from './set'
import type { ClassState, State } from './stateTypes'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'

/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * setter (dispatcher) supports thunks.
 *
 * @param {Function} reducer
 * @param {string} className
 * @returns {[ClassState<S>, set]}
 */
export default <S extends State>(reducer: Reducer<S>, className: string): [ClassState<S>, set<S>] => {
  const { context } = THUNK_CONTEXT_MAP.theMap[className]

  const { refClassState, setClassState: setClassState_c } = useContext(context)
  const getClassState = useCallback(() => {
    return refClassState.current
  }, [refClassState])

  const setClassState = useCallback(
    (newClassState: ClassState<S>) => {
      refClassState.current = newClassState
      setClassState_c(newClassState)
    },
    [refClassState, setClassState_c],
  )

  // 5. reducer.
  const reduce = useCallback(
    (action: BaseAction): ClassState<S> => {
      const classState = getClassState()
      const newClassState = reducer(classState, action)
      return newClassState
    },
    [reducer, getClassState],
  )

  // augmented setter.
  const set: set<S> = useCallback(
    (action) => {
      if (typeof action === 'function') {
        // action is Thunk<S, A>
        action(set, getClassState)
        return
      }

      // action is not function. so action is BaseAction
      const newClassState = reduce(action)
      setClassState(newClassState)
    },
    [getClassState, setClassState, reduce],
  )

  return [refClassState.current, set]
}
