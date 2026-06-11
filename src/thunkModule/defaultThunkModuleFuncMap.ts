import type { ActionFunc } from '../action'
import { init } from '../init'
import { remove } from '../remove'
import { update } from '../update'

export const DEFAULT_THUNK_MODULE_FUNC_MAP: DefaultThunkModuleFuncMap = {
  init,
  update,
  remove,
}

export type DefaultThunkModuleFuncMap = {
  // biome-ignore lint/suspicious/noExplicitAny: DefaultThunkModuleFuncMap can be any type.
  [action: string]: ActionFunc<any>
}
