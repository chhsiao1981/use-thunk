import type { ActionFunc } from './action'
import type { Reducer } from './reducer'
import type { State } from './stateTypes'

export interface ThunkModuleFunc<S extends State> {
  [action: string]: ActionFunc<S>
}

// This is used as the parameter for useThunk.
export type ThunkModule<S extends State, T extends ThunkModuleFunc<S>> = {
  myClass: string
  default?: Reducer<S>
  defaultState?: S
} & T

export type ThunkModuleToFunc<T> = Omit<T, 'myClass' | 'default' | 'defaultState'>
