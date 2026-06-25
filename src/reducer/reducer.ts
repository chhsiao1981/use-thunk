import type { Reducer as rReducer } from 'react'
import type { BaseAction } from '../action'
import type { ModuleState, State } from '../states'

// Reducer
export type Reducer<S extends State> = rReducer<ModuleState<S>, BaseAction>
