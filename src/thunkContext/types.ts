import type { Dispatch, SetStateAction } from 'react'
import type { ModuleState, State } from '../states'

export type Context<S extends State> = {
  // INFO: we use refModuleState to reference across all the useThunk of the same module in different ops.
  refModuleState: { current: ModuleState<S> }
  setModuleState: Dispatch<SetStateAction<ModuleState<S>>>
}
