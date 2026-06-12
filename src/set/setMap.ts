import type { ActionFunc } from '../action'
import type { set } from '../set'
import type { State } from '../states'
import type { doModule, ThunkModule } from '../thunkModule'
import { DEFAULT_DO_MODULE, type defaultDoModule } from '../thunkModule'

// biome-ignore lint/suspicious/noExplicitAny: unknown requires same type in list, use any for possible different types.
type VoidReturnType<T extends (...params: any[]) => unknown> = (...params: Parameters<T>) => void

export type setMap<S extends State, T extends doModule<S>> = {
  [action in keyof T]: VoidReturnType<T[action]>
} & Omit<DefaultSetMap, keyof T>

export type DefaultSetMap = {
  [action in keyof defaultDoModule]: VoidReturnType<defaultDoModule[action]>
}

export interface setMapByModuleMap<S extends State, T extends doModule<S>> {
  [moduleMap: string]: setMap<S, T>
}

export const constructSetMap = <S extends State, T extends doModule<S>>(
  theDo: ThunkModule<S>,
  set: set<S>,
  setMap: setMap<S, T>,
) => {
  Object.keys(theDo)
    // default and name are reserved words.
    // functions starting reduce are included in default and not exported.
    .filter((each) => typeof theDo[each] === 'function')
    .reduce((val, eachAction) => {
      if (val[eachAction]) {
        return val
      }

      // because action is a function.
      const action = theDo[eachAction] as ActionFunc<S>

      // @ts-expect-error eachAction is in setMap<S, R>
      // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
      val[eachAction] = (...params: any[]) => set(action(...params))
      return val
    }, setMap)

  Object.keys(DEFAULT_DO_MODULE).reduce((val, eachAction) => {
    if (val[eachAction]) {
      return val
    }

    const action = DEFAULT_DO_MODULE[eachAction]

    // @ts-expect-error eachAction is in setMap<S, R>
    // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
    val[eachAction] = (...params: any[]) => set(action(...params))
    return val
  }, setMap)

  return setMap
}
