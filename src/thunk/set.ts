// XXX requiring to import directly from action/ActionOrThunk, or it will cause looping.
import type { ActionOrThunk } from '../action/ActionOrThunk'
import type { State } from '../states'

// set
export type set<S extends State> = (actionOrID: ActionOrThunk<S> | string, data?: Partial<S>) => void
