import type { Context as rContext } from 'react'
import type { ModuleState, State } from '../states'
import type { Context } from './types'

export type ThunkContextMap = {
  theMap: {
    [moduleName: string]: {
      // biome-ignore lint/suspicious/noExplicitAny: module can be any type
      context: rContext<Context<any>>
      // biome-ignore lint/suspicious/noExplicitAny: module can be any type
      moduleState: ModuleState<any>
    }
  }
  theList: string[]
}

export const THUNK_CONTEXT_MAP: ThunkContextMap = {
  theMap: {},
  theList: [],
}

/////
// for testing
/////
export const resetThunkContetMap = () => {
  Object.assign(THUNK_CONTEXT_MAP, { theMap: {}, theList: [] })
}

/**
 * get the module state by module name.
 *
 * @param moduleName module name.
 * @returns module state.
 */
export const getMod = <S extends State>(moduleName: string): Readonly<ModuleState<S>> => {
  return THUNK_CONTEXT_MAP.theMap[moduleName].moduleState
}
