import type { Reducer } from './reducer';
import type { set } from './set';
import type { ClassState, State } from './stateTypes';
/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * setter (dispatcher) supports thunks.
 *
 * @param {Function} reducer
 * @param {string} className
 * @returns {[ClassState<S>, set]}
 */
declare const _default: <S extends State>(reducer: Reducer<S>, className: string) => [ClassState<S>, set<S>];
export default _default;
