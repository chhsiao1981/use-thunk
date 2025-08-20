//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js

import { type Dispatch, type Reducer, useCallback, useRef, useState } from 'react'
import type { BaseAction } from './action'
import { type NodeStateMapByClass, type State, StateType } from './stateTypes'

// @ts-expect-error NODE_STATE_MAP_BY_CLASS can be any type
const NODE_STATE_MAP_BY_CLASS: NodeStateMapByClass = {}

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
export const useThunkReducer = <S extends State, A extends BaseAction>(
  reducer: Reducer<S, A>,
  initArg: S,
  className: string,
  stateType: StateType,
  init: (s: S) => S = (s) => s,
): [S, Dispatch<A | Thunk<S, A>>] => {
  // 1. ensure shared state.
  if (stateType === StateType.SHARED && !NODE_STATE_MAP_BY_CLASS[className]) {
    NODE_STATE_MAP_BY_CLASS[className] = init(initArg)
  }

  const sharedState = NODE_STATE_MAP_BY_CLASS[className]

  // 2. initState
  const initState = stateType === StateType.SHARED ? sharedState : () => init(initArg)

  // 3. renderState
  const [renderState, setRenderState] = useState(initState)

  // 4. hookState
  const hookState = stateType === StateType.SHARED ? sharedState : renderState

  // 5. state management.
  const state = useRef(hookState)
  const getState = useCallback(() => state.current, [state])
  const setState = useCallback(
    (newState: S) => {
      state.current = newState
      if (stateType === StateType.SHARED) {
        NODE_STATE_MAP_BY_CLASS[className] = newState
      }
      setRenderState(newState)
    },
    [state, setRenderState],
  )

  // 6. reducer.
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

export default useThunkReducer

export const cleanSharedState = () => {
  const classNames = Object.keys(NODE_STATE_MAP_BY_CLASS)
  classNames.map((each) => delete NODE_STATE_MAP_BY_CLASS[each])
}
