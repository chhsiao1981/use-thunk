//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { type Dispatch, type Reducer, useCallback, useRef, useState } from 'react'
import type { BaseAction } from './action'
import type { State } from './stateTypes'

export type Thunk<S extends State, A extends BaseAction> = (
  dispatch: Dispatch<ActionOrThunk<S, A>>,
  getState: () => S,
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
  reducer: Reducer<S, A>,
  initArg: S,
  // biome-ignore lint/suspicious/noExplicitAny: params can by any types.
  init?: (...params: any[]) => S,
): [S, Dispatch<A | Thunk<S, A>>] => {
  // 1. initState
  const initState = init ? () => init(initArg) : initArg

  // 2. renderState
  const [renderState, setRenderState] = useState(initState)

  // 3. hookState
  const hookState = renderState

  // 4. state management.
  const state = useRef(hookState)
  const getState = useCallback(() => state.current, [state])
  const setState = useCallback(
    (newState: S) => {
      state.current = newState
      setRenderState(newState)
    },
    [state, setRenderState],
  )

  // 5. reducer.
  const reduce = useCallback(
    (action: A): S => {
      return reducer(getState(), action)
    },
    [reducer, getState],
  )

  // augmented dispatcher.
  const dispatch = useCallback(
    (action: A | Thunk<S, A>) => {
      if (typeof action === 'function') {
        action(dispatch, getState)
        return
      }

      setState(reduce(action))
    },
    [getState, setState, reduce],
  )

  return [hookState, dispatch]
}
