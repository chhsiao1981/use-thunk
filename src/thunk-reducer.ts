//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js
//
//The built-in useReducer does not immediately evaluate the dispatch if called within useEffect.
//Sometimes we do want such immediate evaluation feature for easier implementation.
//(We don't want lots of useEffect in the components.)

import { type Dispatch, type Reducer, useCallback, useRef, useState } from 'react'

export type Thunk<State, BaseAction> = (
  dispatch: Dispatch<ActionOrThunk<State, BaseAction>>,
  getState: () => State,
) => void

export type ActionOrThunk<State, BaseAction> = BaseAction | Thunk<State, BaseAction>
/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {Sas} initArg
 * @param {Function} [init]
 * @returns {[Sas, Dispatch]}
 */
export const useThunkReducer = <State, BaseAction>(
  reducer: Reducer<State, BaseAction>,
  initArg: State,
  init: (s: State) => State = (s) => s,
): [State, Dispatch<BaseAction | Thunk<State, BaseAction>>] => {
  const [hookState, setHookState] = useState(() => init(initArg))

  // State management.
  const state = useRef(hookState)
  const getState = useCallback(() => state.current, [state])
  const setState = useCallback(
    (newState: State) => {
      state.current = newState
      setHookState(newState)
    },
    [state, setHookState],
  )

  // Reducer.
  const reduce = useCallback(
    (action: BaseAction): State => {
      return reducer(getState(), action)
    },
    [reducer, getState],
  )

  // augmented dispatcher.
  const dispatch = useCallback(
    (action: BaseAction | Thunk<State, BaseAction>) => {
      if (typeof action === 'function') {
        // @ts-expect-error @typescript-eslint/no-unsafe-return because action is function
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
