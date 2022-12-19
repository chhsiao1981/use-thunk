import { Dispatch, Reducer } from 'react';
export interface Thunk<S, A> {
    (dispatch: Dispatch<A | Thunk<S, A>>, getState: () => S): void;
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
export declare const useThunkReducer: <S, A>(reducer: Reducer<S, A | Thunk<S, A>>, initArg: S, init?: (s: S) => S) => [S, Dispatch<A | Thunk<S, A>>];
export default useThunkReducer;
