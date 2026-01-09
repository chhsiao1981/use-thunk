import { init } from './init'
import { remove } from './remove'
import { setData } from './setData'

export const DEFAULT_THUNK_MODULE_FUNC_MAP = {
  init,
  setData,
  remove,
}

export type DefaultThunkModuleFuncMap = typeof DEFAULT_THUNK_MODULE_FUNC_MAP
