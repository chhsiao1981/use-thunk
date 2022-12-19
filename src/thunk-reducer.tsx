//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812

import { Dispatch, Reducer, useReducer } from 'react'

export interface Thunk<S, A> {
  (dispatch: Dispatch<A | Thunk<S, A>>, getState: () => S): void
}

/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {S} initArg
 * @param {Function} [init]
 * @returns {[S, Dispatch]}
 */
export const useThunkReducer = <S, A>(reducer: Reducer<S, A | Thunk<S, A>>, initArg: S, init: (s: S) => S = (s) => s): [S, Dispatch<A | Thunk<S, A>>] => {
  const [state, dispatch] = useReducer(reducer, initArg, init)

  let thunkDispatch = (action: A | Thunk<S, A>) => {
    if (typeof action === 'function') {
      let getState = () => state
      // @ts-ignore because action is function
      action(thunkDispatch, getState)
    } else {
      dispatch(action)
    }
  }

  return [state, thunkDispatch]
}

export default useThunkReducer
