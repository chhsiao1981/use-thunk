//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js
//
//The built-in useReducer does not immediately evaluate the dispatch if called within useEffect.
//Sometimes we do want such immediate evaluation feature for easier implementation.
//(We don't want lots of useEffect in the components.)

import { Dispatch, Reducer, useCallback, useRef, useState } from 'react'

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
    const [hookState, setHookState] = useState(() => init(initArg))

    // State management.
    const state = useRef(hookState)
    const getState = useCallback(() => state.current, [state])
    const setState = useCallback((newState: S) => {
        state.current = newState
        setHookState(newState)
    }, [state, setHookState])

    // Reducer.
    const reduce = useCallback((action: A): S => {
        return reducer(getState(), action)
    }, [reducer, getState])

    // augmented dispatcher.
    const dispatch = useCallback((action: A | Thunk<S, A>) => {
        return typeof action === 'function'
            // @ts-ignore because action is function
            ? action(dispatch, getState)
            : setState(reduce(action))
    }, [getState, setState, reduce])

    return [hookState, dispatch]
}

export default useThunkReducer
