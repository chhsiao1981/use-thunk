import type { set } from '../set'
import type { ClassState, State } from '../stateTypes'

// Thunk
export type Thunk<S extends State> = (set: set<S>, getClassState: () => ClassState<S>) => void
