import type { ModuleState, State } from '../states'

// getModuleState
export type getModuleState<S extends State> = () => ModuleState<S>
