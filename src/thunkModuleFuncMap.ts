import { init } from './init'
import { remove } from './remove'
import { setData, update } from './update'

export const DEFAULT_THUNK_MODULE_FUNC_MAP = {
  init,
  update,
  setData,
  remove,
}

export type DefaultThunkModuleFuncMap = typeof DEFAULT_THUNK_MODULE_FUNC_MAP
