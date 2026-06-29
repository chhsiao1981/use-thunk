import type { Context as rContext } from 'react'
import type { ModuleState } from '../states'
import type { Context } from './types'

export type ThunkContextMap = {
  theMap: {
    [moduleName: string]: {
      // biome-ignore lint/suspicious/noExplicitAny: module can be any type
      context: rContext<Context<any>>
      // biome-ignore lint/suspicious/noExplicitAny: module can be any type
      initModuleState: ModuleState<any>
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
