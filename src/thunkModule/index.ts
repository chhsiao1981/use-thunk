import type { ThunkFunc } from '../action'
import type { Reducer } from '../reducer'
import type { State } from '../states'
import { DEFAULT_DO_MODULE, type defaultDoModule } from './defaultDoModule'
export { DEFAULT_DO_MODULE, type defaultDoModule }

export interface doModule<S extends State> {
  [action: string]: ThunkFunc<S>
}

// This is used as the parameter for useThunk.
export type ThunkModule<S extends State> = {
  name: string
  default?: Reducer<S>
  defaultState: S

  // The rest of the variables are doModule.
  // Specifying index-signatures to include all the variables.
  [action: string]: ThunkFunc<S> | string | Reducer<S> | S | undefined
}

// biome-ignore lint/suspicious/noExplicitAny: ok for type utility functions.
export type toDoModule<T extends ThunkModule<any>> = Omit<T, 'name' | 'default' | 'defaultState'>
