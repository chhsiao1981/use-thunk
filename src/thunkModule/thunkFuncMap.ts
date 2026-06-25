import type { BaseActionFunc } from '../action'
import type { State } from '../states'
import type { ThunkFunc } from '../thunk'
import type { ThunkModule } from './thunkModule'

export interface ThunkFuncMap<S extends State> {
  [action: string]: ThunkFunc<S> | BaseActionFunc
}

// biome-ignore lint/suspicious/noExplicitAny: ok for type utility functions.
export type toThunkFuncMap<T extends ThunkModule<any>> = Omit<T, 'name' | 'defaultState'>
