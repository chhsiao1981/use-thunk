import type { Reducer as rReducer } from 'react';
import type { BaseAction } from '../action';
import type { ModuleState, State } from '../states';
import { createReducer } from './createReducer';
export { createReducer };
export type Reducer<S extends State> = rReducer<ModuleState<S>, BaseAction>;
export type ReduceFunc<S extends State> = (state: ModuleState<S>, action: BaseAction) => ModuleState<S>;
