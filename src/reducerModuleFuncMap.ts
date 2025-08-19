import { addChild } from './addChild'
import { addLink } from './addLink'
import { init } from './init'
import { remove } from './remove'
import { removeChild } from './removeChild'
import { removeLink } from './removeLink'
import { setData } from './setData'

export const DEFAULT_REDUCER_MODULE_FUNC_MAP = {
  init,
  setData,
  remove,

  // XXX addChild shouldn't be used outside of init.
  addChild,

  removeChild,

  addLink,
  removeLink,
}

export type DefaultReducerModuleFuncMap = typeof DEFAULT_REDUCER_MODULE_FUNC_MAP
