import type { Reducer as rReducer } from 'react'
import type { BaseAction } from '../action'
import type { ModuleState, State } from '../states'

import { createReducer } from './createReducer'
export { createReducer }

// Reducer
export type Reducer<S extends State> = rReducer<ModuleState<S>, BaseAction>

// ReduceFunc
export type ReduceFunc<S extends State> = (state: ModuleState<S>, action: BaseAction) => ModuleState<S>
