import { useCallback, useRef, useState, Dispatch, Reducer } from 'react'

export interface Thunk<S, A> {
  (dispatch: Dispatch<A | Thunk<S, A>>, getState: () => S): void
}

/**
 * @function Thunk
 * @param {Dispatch} dispatch
 * @param {Function} getState
 * @returns {void|*}
 */

/**
 * @function Dispatch
 * @param {Object|Thunk} action
 * @returns {void|*}
 */

/**
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {*} initialArg
 * @param {Function} [init]
 * @returns {[*, Dispatch]}
 */
export const useThunkReducer = <S, A>(reducer: Reducer<S, A>, initialArg: S, init: (s: S) => S = (s) => s): [S, Dispatch<A | Thunk<S, A>>] => {
  const [hookState, setHookState] = useState(() => init(initialArg));

  // State management.
  const state = useRef(hookState);
  const getState = useCallback(() => state.current, [state]);
  const setState = useCallback((newState: S) => {
    state.current = newState;
    setHookState(newState);
  }, [state, setHookState]);

  // Reducer.
  const reduce = useCallback((action: A): S => {
    return reducer(getState(), action);
  }, [reducer, getState]);

  // Augmented dispatcher.
  const dispatch = useCallback((action: any): void => {
    return typeof action === 'function'
      ? action(dispatch, getState)
      : setState(reduce(action));
  }, [getState, setState, reduce]);

  return [hookState, dispatch];
}

export default useThunkReducer
