import type { Reducer } from '../reducer';
import type { set } from '../set';
import { type ModuleState, type State } from '../states';
/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * setter (dispatcher) supports thunks.
 */
declare const _default: <S extends State>(reducer: Reducer<S>, moduleName: string) => [ModuleState<S>, set<S>];
export default _default;
