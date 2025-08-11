import type { Dispatch, Reducer } from 'react'
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
export declare const useThunkReducer: <State, BaseAction>(
  reducer: Reducer<State, BaseAction>,
  initArg: State,
  init?: (s: State) => State,
) => [State, Dispatch<BaseAction | Thunk<State, BaseAction>>]
export default useThunkReducer
