import type { ActionFunc } from '../action'
import { init } from '../thunks/init'
import { remove } from '../thunks/remove'
import { update } from '../thunks/update'

export const DEFAULT_DO_MODULE: defaultDoModule = {
  init,
  update,
  remove,
}

export type defaultDoModule = {
  // biome-ignore lint/suspicious/noExplicitAny: defaultDoModule can be any type.
  [action: string]: ActionFunc<any>
}
