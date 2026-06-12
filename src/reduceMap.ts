import type { ReduceFunc } from './reducer'
import type { State } from './stateTypes'
import { INIT, reduceInit } from './thunks/init/initCore'
import { REMOVE, reduceRemove } from './thunks/remove'
import { reduceSetDefaultID, SET_DEFAULT_ID } from './thunks/setDefaultID'
import { reduceUpdate, UPDATE } from './thunks/update'
import { reduceUpsert, UPSERT } from './thunks/upsert'

export interface ReduceMap<S extends State> {
  [type: string]: ReduceFunc<S>
}

// default reduceMap
export const DEFAULT_REDUCE_MAP: <S extends State>() => ReduceMap<S> = () => ({
  [INIT]: reduceInit,
  [UPDATE]: reduceUpdate,
  [REMOVE]: reduceRemove,
  [UPSERT]: reduceUpsert,

  // setDefaultID.
  // Typically we don't need this in programming.
  // The defaultID is automatically determined if defaultID is not set.
  [SET_DEFAULT_ID]: reduceSetDefaultID,
})
