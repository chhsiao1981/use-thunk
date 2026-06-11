import type { ThunkFunc } from '../action'
import type { Reducer } from '../reducer'
import type { State } from '../stateTypes'

export interface ThunkModuleBase<S extends State> {
  [idx: string]: ThunkFunc<S> | string | Reducer<S> | S | undefined
}

export interface ThunkModuleFunc<S extends State> extends ThunkModuleBase<S> {
  [action: string]: ThunkFunc<S>
}

// This is used as the parameter for useThunk.
export type ThunkModule<S extends State> = {
  name?: string
  myClass?: string // XXX to deprecate
  default?: Reducer<S>
  defaultState: S
} & ThunkModuleBase<S>

export type ThunkModuleToFunc<T> = Omit<T, 'name' | 'myClass' | 'default' | 'defaultState'>
