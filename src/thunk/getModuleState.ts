import type { ModuleState, State } from '../states'

/**
 * get module state.
 */
export type getModuleState<S extends State> = () => ModuleState<S>
