import type { DispatchFuncMap } from './dispatchFuncMap';
import type { ReducerModule, ReducerModuleFunc } from './reducer';
import type { ClassState, State, StateType } from './stateTypes';
/**********
 * useReducer
 **********/
declare const _default: <S extends State, R extends ReducerModuleFunc<S>>(theDo: ReducerModule<S, R>, stateType: StateType, init?: (...params: any[]) => S) => [ClassState<S>, DispatchFuncMap<S, R>];
export default _default;
