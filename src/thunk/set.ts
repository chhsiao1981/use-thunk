// XXX requiring to import directly from action/ActionOrThunk, or it will cause looping.
import type { ActionOrThunk } from '../action/ActionOrThunk'
import type { State } from '../states'

/**
 * XXX (moduleState) set theID to defaultID if defaultID does not exist.
 *
 * * set(id, data): upsert data to moduleState.
 * * set(thunk): evaluate thunk<S>.
 */
export type set<S extends State> = (
  actionOrID: ActionOrThunk<S> | string | null | undefined,
  data?: Partial<S>,
) => void
