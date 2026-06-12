import type { ActionFunc } from '../action'
import { init, remove, update } from '../defaultThunks'

export const DEFAULT_DO_MODULE: defaultDoModule = {
  init,
  update,
  remove,
}

export type defaultDoModule = {
  // biome-ignore lint/suspicious/noExplicitAny: defaultDoModule can be any type.
  [action: string]: ActionFunc<any>
}
