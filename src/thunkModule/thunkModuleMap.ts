import type { ModuleState, State } from '../states'

export type ThunkModuleMap = {
  theMap: {
    [moduleName: string]: {
      // biome-ignore lint/suspicious/noExplicitAny: module can be any type
      moduleState: ModuleState<any>
    }
  }
}

export const THUNK_MODULE_MAP: ThunkModuleMap = {
  theMap: {},
}

/**
 * get the module state by module name.
 *
 * @param moduleName module name.
 * @returns module state.
 */
export const getMod = <S extends State>(moduleName: string): Readonly<ModuleState<S>> => {
  return THUNK_MODULE_MAP.theMap[moduleName].moduleState
}
