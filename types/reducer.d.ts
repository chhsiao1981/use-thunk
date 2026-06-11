import type { Reducer as rReducer } from 'react';
import type BaseAction from './action/baseAction';
import type { ModuleState, State } from './stateTypes';
export type Reducer<S extends State> = rReducer<ModuleState<S>, BaseAction>;
export type ReduceFunc<S extends State> = (state: ModuleState<S>, action: BaseAction) => ModuleState<S>;
