//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { type Dispatch, type Reducer, useCallback, useContext } from 'react'
import type { BaseAction } from './action'
import type { ClassState, State } from './stateTypes'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'

export type Thunk<S extends State, A extends BaseAction> = (
  dispatch: Dispatch<ActionOrThunk<S, A>>,
  getClassState: () => ClassState<S>,
) => void

export type ActionOrThunk<S extends State, A extends BaseAction> = A | Thunk<S, A>
/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {string} className
 * @returns {[ClassState<S>, Dispatch]}
 */
export default <S extends State, A extends BaseAction>(
  reducer: Reducer<ClassState<S>, A>,
  className: string,
): [ClassState<S>, Dispatch<A | Thunk<S, A>>] => {
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
    (action: A): ClassState<S> => {
      const classState = getClassState()
      const newClassState = reducer(classState, action)
      return newClassState
    },
    [reducer, getClassState],
  )

  // augmented dispatcher.
  const dispatch = useCallback(
    (action: A | Thunk<S, A>) => {
      if (typeof action === 'function') {
        action(dispatch, getClassState)
        return
      }

      const newClassState = reduce(action)
      setClassState(newClassState)
    },
    [getClassState, setClassState, reduce],
  )

  return [refClassState.current, dispatch]
}
