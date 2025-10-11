import { addChild } from './addChild'
import { addLink } from './addLink'
import { init } from './init'
import { remove } from './remove'
import { removeChild } from './removeChild'
import { removeLink } from './removeLink'
import { setData } from './setData'

export const DEFAULT_THUNK_MODULE_FUNC_MAP = {
  init,
  setData,
  remove,

  addChild,

  removeChild,

  addLink,
  removeLink,
}

export type DefaultThunkModuleFuncMap = typeof DEFAULT_THUNK_MODULE_FUNC_MAP
