import type { BaseAction } from '../action'
import type { ModuleState, State } from '../states'

// ReduceFunc
export type ReduceFunc<S extends State> = (state: ModuleState<S>, action: BaseAction) => ModuleState<S>
