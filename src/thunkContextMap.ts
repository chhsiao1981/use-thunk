import type { Context as rContext } from 'react'
import type { ClassState } from './stateTypes'
import type { Context } from './thunkContextTypes'

export type ThunkContextMap = {
  theMap: {
    [classname: string]: {
      // biome-ignore lint/suspicious/noExplicitAny: ThunkContextMap can be any type
      context: rContext<Context<any>>

      // INFO We need to use refClassState to sync all the classState in all ops.
      // biome-ignore lint/suspicious/noExplicitAny: ThunkContextMap can be any type
      refClassState: { current: ClassState<any> }
    }
  }
  theList: string[]
}

export const THUNK_CONTEXT_MAP: ThunkContextMap = {
  theMap: {},
  theList: [],
}
