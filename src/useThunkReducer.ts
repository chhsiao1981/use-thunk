//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { type Dispatch, type Reducer, useCallback, useRef, useState } from 'react'
import type { BaseAction } from './action'
import type { ClassState, State } from './stateTypes'

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
 * @param {State} initArg
 * @param {Function} [init]
 * @returns {[State, Dispatch]}
 */
export default <S extends State, A extends BaseAction>(
  reducer: Reducer<ClassState<S>, A>,
  initArg: ClassState<S>,
  init?: (initArg: ClassState<S>) => ClassState<S>,
): [ClassState<S>, Dispatch<A | Thunk<S, A>>] => {
  // 1. initState
  const initClassState = init ? () => init(initArg) : initArg

  // 2. renderState
  const [renderClassState, setRenderClassState] = useState(initClassState)

  // 3. hookState
  const hookClassState = renderClassState

  // 4. state management.
  const classState = useRef(hookClassState)
  const getClassState = useCallback(() => classState.current, [classState])
  const setClassState = useCallback(
    (newClassState: ClassState<S>) => {
      classState.current = newClassState
      setRenderClassState(newClassState)
    },
    [classState, setRenderClassState],
  )

  // 5. reducer.
  const reduce = useCallback(
    (action: A): ClassState<S> => {
      return reducer(getClassState(), action)
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

      setClassState(reduce(action))
    },
    [getClassState, setClassState, reduce],
  )

  return [hookClassState, dispatch]
}
