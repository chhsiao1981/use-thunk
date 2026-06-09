import type { ActionFunc } from './action'
import type { Reducer } from './reducer'
import type { State } from './stateTypes'

export interface ThunkModuleBase<S extends State> {
  [idx: string]: ActionFunc<S> | string | Reducer<S> | S | undefined
}

export interface ThunkModuleFunc<S extends State> extends ThunkModuleBase<S> {
  [action: string]: ActionFunc<S>
}

// This is used as the parameter for useThunk.
export type ThunkModule<S extends State> = {
  myClass: string
  default?: Reducer<S>
  defaultState: S
} & ThunkModuleBase<S>

export type ThunkModuleToFunc<T> = Omit<T, 'myClass' | 'default' | 'defaultState'>
