import type { Reducer as rReducer } from 'react';
import type { ActionFunc, BaseAction } from './action';
import type { ClassState, State } from './stateTypes';
export type Reducer<S extends State> = rReducer<ClassState<S>, BaseAction>;
export type ReducerModule<S extends State, R extends ReducerModuleFunc<S>> = {
    myClass: string;
    default?: Reducer<S>;
    defaultState?: S;
} & R;
export type ModuleToFunc<T> = Omit<T, 'myClass' | 'default' | 'defaultState'>;
export interface ReducerModuleFunc<S extends State> {
    [action: string]: ActionFunc<S>;
}
export type ReduceFunc<S extends State> = (state: ClassState<S>, action: BaseAction) => ClassState<S>;
