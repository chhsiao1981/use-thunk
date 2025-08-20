import type { ReducerModuleFunc } from './reducer'
import type { DefaultReducerModuleFuncMap } from './reducerModuleFuncMap'
import type { State } from './stateTypes'

// biome-ignore lint/suspicious/noExplicitAny: unknown requires same type in list, use any for possible different types.
type VoidReturnType<T extends (...params: any[]) => unknown> = (...params: Parameters<T>) => void

export type DispatchFuncMap<S extends State, R extends ReducerModuleFunc<S>> = {
  [action in keyof R]: VoidReturnType<R[action]>
} & Omit<DefaultDispatchFuncMap, keyof R>

export type DefaultDispatchFuncMap = {
  [action in keyof DefaultReducerModuleFuncMap]: VoidReturnType<DefaultReducerModuleFuncMap[action]>
}

export interface DispatchFuncMapByClassMap<S extends State, R extends ReducerModuleFunc<S>> {
  [className: string]: DispatchFuncMap<S, R>
}

export interface RefDispatchFuncMapByClassMap<S extends State, R extends ReducerModuleFunc<S>> {
  current: DispatchFuncMapByClassMap<S, R>
}
