import type { DispatchFuncMap } from './dispatchFuncMap';
import type { ReducerModule, ReducerModuleFunc } from './reducer';
import { type ClassState, type State, StateType } from './stateTypes';
/**********
 * useReducer
 **********/
export declare const useReducer: <S extends State, R extends ReducerModuleFunc<S>>(theDo: ReducerModule<S, R>, stateType?: StateType) => [ClassState<S>, DispatchFuncMap<S, R>];
export declare const cleanSharedDispatchMap: () => void;
