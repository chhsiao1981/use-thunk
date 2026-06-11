import type { Context as rContext } from 'react'
import type { ModuleState } from './stateTypes'
import type { Context } from './thunkContextTypes'

export type ThunkContextMap = {
  theMap: {
    [moduleName: string]: {
      // biome-ignore lint/suspicious/noExplicitAny: ThunkContextMap can be any type
      context: rContext<Context<any>>

      // we need to use refModuleState to sync all the moduleState in all ops.
      // biome-ignore lint/suspicious/noExplicitAny: ThunkContextMap can be any type
      refModuleState: { current: ModuleState<any> }
    }
  }
  theList: string[]
}

export const THUNK_CONTEXT_MAP: ThunkContextMap = {
  theMap: {},
  theList: [],
}
