import { init } from './init'
import { remove } from './remove'
import { setDefaultID } from './setDefaultID'
import { update } from './update'
import { upsert } from './upsert'

/**
 * DEFAULT_THUNK_FUNC_MAP
 *
 * the default thunk functions.
 * including init, update, unsert, remove, setDefaultID, and refresh.
 */
export const DEFAULT_THUNK_FUNC_MAP = {
  init,
  update,
  upsert,
  remove,
  setDefaultID,

  // XXX _setDefaultID is for internal use in getStateByModule.
  _setDefaultID: setDefaultID,
}

export const RESERVE_THUNK_FUNC_MAP = {
  // XXX _setDefaultID is for internal use in getStateByModule.
  _setDefaultID: setDefaultID,
}

export const RESERVE_THUNK_FUNC_MAPS = Object.keys(RESERVE_THUNK_FUNC_MAP)

export type defaultThunkFuncMap = typeof DEFAULT_THUNK_FUNC_MAP

export type reserveThunkFuncMap = typeof RESERVE_THUNK_FUNC_MAP
