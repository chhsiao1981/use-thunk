import type { ActionFunc } from './action'
import type { DispatchFuncMap } from './dispatchFuncMap'
import type { Reducer } from './reducer'
import type { ClassState, State } from './stateTypes'

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

export type ThunkType<S extends State, R extends ThunkModuleFunc<S>> = {
  classState: ClassState<S>
  dispatchMap: DispatchFuncMap<S, R>
}
