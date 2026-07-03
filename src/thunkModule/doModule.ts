import type { ActionFunc } from '../action'
import { DEFAULT_THUNK_FUNC_MAP, type defaultThunkFuncMap } from '../defaultThunkFuncs'
import { RESERVE_THUNK_FUNC_MAP } from '../defaultThunkFuncs/defaultThunkFuncMap'
import type { State } from '../states'
import type { set } from '../thunk'
import type { VoidReturnType } from '../utils'
import type { toThunkFuncMap } from './thunkFuncMap'
import type { ThunkModule } from './thunkModule'

/**
 * doModule: the thunk functions of module already wrapped with set (no need to specify set/dispatch when using these functions).
 */
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

export type toDoModule<S extends State, T extends ThunkModule<S>> = doModule<S, T>

export const constructDoModule = <S extends State, T extends ThunkModule<S>>(module: T, set: set<S>) => {
  const doModule = Object.keys(module)
    // @ts-expect-error each should not be in RESERVE_THUNK_FUNC_MAP
    .filter((each) => typeof module[each] === 'function' && !RESERVE_THUNK_FUNC_MAP[each])
    .reduce(
      (val, eachAction) => {
        // because action is a function.
        const action = module[eachAction] as ActionFunc<S>

        // @ts-expect-error we would like to reduce to doModule
        // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
        val[eachAction] = (...params: any[]) => set(action(...params))
        return val
      },
      {} as doModule<S, T>,
    )

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

  DO_MODULE_MAP[module.name] = doModule

  return doModule
}

/**
 * get the doModule by module name.
 *
 * @param moduleName module name.
 * @returns doModule
 */
export const doMod = <S extends State, T extends ThunkModule<S>>(moduleName: string) => {
  return DO_MODULE_MAP[moduleName] as toDoModule<S, T>
}
