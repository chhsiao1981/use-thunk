import { init } from './init'
import { remove } from './remove'
import { setDefaultID } from './setDefaultID'
import { update } from './update'
import { upsert } from './upsert'

export const DEFAULT_THUNK_FUNC_MAP = {
  init,
  update,
  upsert,
  remove,
  setDefaultID,
}

export type defaultThunkFuncMap = typeof DEFAULT_THUNK_FUNC_MAP
