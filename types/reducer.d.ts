import type { Reducer as rReducer } from 'react';
import type { BaseAction } from './action';
import type { ClassState, State } from './stateTypes';
export type Reducer<S extends State> = rReducer<ClassState<S>, BaseAction>;
export type ReduceFunc<S extends State> = (state: ClassState<S>, action: BaseAction) => ClassState<S>;
