import { type Dispatch, type Reducer } from 'react';
import type { BaseAction } from './action';
import type { State } from './stateTypes';
export type Thunk<S extends State, A extends BaseAction> = (dispatch: Dispatch<ActionOrThunk<S, A>>, getState: () => S) => void;
export type ActionOrThunk<S extends State, A extends BaseAction> = A | Thunk<S, A>;
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
declare const _default: <S extends State, A extends BaseAction>(reducer: Reducer<S, A>, initArg: S, init?: (...params: any[]) => S) => [S, Dispatch<A | Thunk<S, A>>];
export default _default;
