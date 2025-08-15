/*
MIT License

Copyright (c) 2019 Nathan Buchar <hello@nathanbuchar.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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
