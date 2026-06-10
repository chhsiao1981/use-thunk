import type { Dispatch } from './dispatch';
import type { Reducer } from './reducer';
import type { ClassState, State } from './stateTypes';
/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {string} className
 * @returns {[ClassState<S>, Dispatch]}
 */
declare const _default: <S extends State>(reducer: Reducer<S>, className: string) => [ClassState<S>, Dispatch<S>];
export default _default;
