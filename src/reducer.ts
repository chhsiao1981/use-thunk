import type { Reducer as rReducer } from 'react'
import type { BaseAction } from './action'
import type { ClassState, State } from './stateTypes'

// Reducer
export type Reducer<S extends State> = rReducer<ClassState<S>, BaseAction>

// ReduceFunc
export type ReduceFunc<S extends State> = (state: ClassState<S>, action: BaseAction) => ClassState<S>
