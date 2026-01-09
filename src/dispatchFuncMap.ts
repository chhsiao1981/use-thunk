import type { ActionFunc, BaseAction } from './action'
import type { State } from './stateTypes'
import type { ThunkModule, ThunkModuleFunc } from './thunk'
import { DEFAULT_THUNK_MODULE_FUNC_MAP, type DefaultThunkModuleFuncMap } from './thunkModuleFuncMap'
import type { Thunk as rThunk } from './useThunkReducer'

// biome-ignore lint/suspicious/noExplicitAny: unknown requires same type in list, use any for possible different types.
type VoidReturnType<T extends (...params: any[]) => unknown> = (...params: Parameters<T>) => void

export type DispatchFuncMap<S extends State, T extends ThunkModuleFunc<S>> = {
  [action in keyof T]: VoidReturnType<T[action]>
} & Omit<DefaultDispatchFuncMap, keyof T>

export type DefaultDispatchFuncMap = {
  [action in keyof DefaultThunkModuleFuncMap]: VoidReturnType<DefaultThunkModuleFuncMap[action]>
}

export interface DispatchFuncMapByClassMap<S extends State, T extends ThunkModuleFunc<S>> {
  [className: string]: DispatchFuncMap<S, T>
}

// biome-ignore lint/suspicious/noExplicitAny: dispatch func map by class map can be any.
export const DISPATCH_FUNC_MAP_BY_CLASS_MAP: DispatchFuncMapByClassMap<any, any> = {}

export const constructDispatchMap = <
  S extends State,
  T extends ThunkModuleFunc<S>,
  A extends BaseAction,
>(
  theDo: ThunkModule<S, T>,
  dispatch: (action: A | rThunk<S, A>) => void,
  dispatchMap: DispatchFuncMap<S, T>,
) => {
  Object.keys(theDo)
    // default and myClass are reserved words.
    // functions starting reduce are included in default and not exported.
    .filter((each) => typeof theDo[each] === 'function')
    .reduce((val, eachAction) => {
      if (val[eachAction]) {
        return val
      }

      const action: ActionFunc<S> = theDo[eachAction]

      // @ts-expect-error eachAction is in DispatchFuncMap<S, R>
      // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
      val[eachAction] = (...params: any[]) => dispatch(action(...params))
      return val
    }, dispatchMap)

  Object.keys(DEFAULT_THUNK_MODULE_FUNC_MAP).reduce((val, eachAction) => {
    if (val[eachAction]) {
      return val
    }

    // @ts-expect-error DEFAULT_REDUCER_MODULE_FUNCS are all ActionFunc<S>
    const action: ActionFunc<S> = DEFAULT_THUNK_MODULE_FUNC_MAP[eachAction]

    // @ts-expect-error eachAction is in DispatchFuncMap<S, R>
    // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
    val[eachAction] = (...params: any[]) => dispatch(action(...params))
    return val
  }, dispatchMap)

  return dispatchMap
}
