import type { ActionFunc } from '../action'
import { DEFAULT_THUNK_FUNC_MAP, type defaultThunkFuncMap } from '../defaultThunkFuncs'
import type { State } from '../states'
import type { set } from '../thunk'
import type { VoidReturnType } from '../utils'
import type { toThunkFuncMap } from './thunkFuncMap'
import type { ThunkModule } from './thunkModule'

export type doModule<S extends State, T extends ThunkModule<S>> = {
  // @ts-expect-error toThunkFuncMap includes only ThunkFunc<S> | BaseActionFunc
  [action in keyof toThunkFuncMap<T>]: VoidReturnType<toThunkFuncMap<T>[action]>
} & Omit<defaultDoModule, keyof toThunkFuncMap<T>>

type defaultDoModule = {
  [action in keyof defaultThunkFuncMap]: VoidReturnType<defaultThunkFuncMap[action]>
}

type doModuleMap<S extends State, T extends ThunkModule<S>> = {
  [module: string]: doModule<S, T>
}

// biome-ignore lint/suspicious/noExplicitAny: DO_MODULE_MAP can by any type
export const DO_MODULE_MAP: doModuleMap<any, any> = {}

// biome-ignore lint/suspicious/noExplicitAny: ok for type utility functions.
export type toDoModule<T extends ThunkModule<any>> = doModule<any, T>

export const constructDoModule = <S extends State, T extends ThunkModule<S>>(
  module: T,
  set: set<S>,
  doModule: doModule<S, T>,
) => {
  Object.keys(module)
    // default and name are reserved words.
    // functions starting reduce are included in default and not exported.
    .filter((each) => typeof module[each] === 'function')
    .reduce((val, eachAction) => {
      if (val[eachAction]) {
        return val
      }

      // because action is a function.
      const action = module[eachAction] as ActionFunc<S>

      // @ts-expect-error we would like to reduce to doModule
      // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
      val[eachAction] = (...params: any[]) => set(action(...params))
      return val
    }, doModule)

  Object.keys(DEFAULT_THUNK_FUNC_MAP).reduce((val, eachAction) => {
    if (val[eachAction]) {
      return val
    }

    // because eachAction is in DEFAULT_THUNK_FUNC_MAP
    const action = DEFAULT_THUNK_FUNC_MAP[eachAction as keyof defaultThunkFuncMap]

    // @ts-expect-error eachAction is in setMap<S, R>
    // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
    val[eachAction] = (...params: any[]) => set(action(...params))
    return val
  }, doModule)

  return doModule
}

export const doMod = <S extends State, T extends ThunkModule<S>>(name: string) => {
  return DO_MODULE_MAP[name] as toDoModule<T>
}
