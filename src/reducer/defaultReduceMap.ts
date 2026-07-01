import {
  INIT,
  REFRESH,
  REMOVE,
  reduceInit,
  reduceRefresh,
  reduceRemove,
  reduceSetDefaultID,
  reduceUpdate,
  reduceUpsert,
  SET_DEFAULT_ID,
  UPDATE,
  UPSERT,
} from '../defaultThunkFuncs'
import type { ReduceMap } from './reduceMap'

// biome-ignore lint/suspicious/noExplicitAny: DEFAULT_REDUCE_MAP can apply to any States.
export const DEFAULT_REDUCE_MAP: ReduceMap<any> = {
  [INIT]: reduceInit,
  [UPDATE]: reduceUpdate,
  [REMOVE]: reduceRemove,
  [UPSERT]: reduceUpsert,

  // setDefaultID.
  // Typically we don't need this in programming.
  // The defaultID is automatically determined if defaultID is not set.
  [SET_DEFAULT_ID]: reduceSetDefaultID,

  // Typically we don't need this in programming.
  // refresh is mainly for force-refreshing in getStateByModule.
  [REFRESH]: reduceRefresh,
}
