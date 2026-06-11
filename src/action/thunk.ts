import type { dispatch } from '../dispatch'
import type { set } from '../set'
import type { ModuleState, State } from '../stateTypes'

// Thunk
export type Thunk<S extends State> = (
  set: set<S>,
  get: (id?: string) => S | null | undefined,
  dispatch: dispatch<S>,
  getModuleState: () => ModuleState<S>,
) => void
