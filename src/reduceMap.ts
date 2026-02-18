import { INIT, reduceInit } from './init'
import type { ReduceFunc } from './reducer'
import { REMOVE, reduceRemove } from './remove'
import { reduceSetData, SET_DATA } from './setData'
import { reduceSetDefaultID, SET_DEFAULT_ID } from './setDefaultID'
import type { State } from './stateTypes'

export interface ReduceMap<S extends State> {
  [type: string]: ReduceFunc<S>
}

// default reduceMap
export const DEFAULT_REDUCE_MAP: <S extends State>() => ReduceMap<S> = () => ({
  // @ts-expect-error baseAction in ReduceMap
  [INIT]: reduceInit,
  [SET_DATA]: reduceSetData,
  [REMOVE]: reduceRemove,

  // setDefaultID.
  // Typically we don't need this in programming.
  // The defaultID is automatically determined if defaultID is not set.
  [SET_DEFAULT_ID]: reduceSetDefaultID,
})
