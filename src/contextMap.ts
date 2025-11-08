import type { Context, Reducer } from 'react'
import type { ClassState } from './stateTypes'
import type { ThunkModule, ThunkType } from './thunkTypes'

export type ContextMap = {
  theList: string[]
  theMap: {
    [myClass: string]: {
      // biome-ignore lint/suspicious/noExplicitAny: state in ContextMap can be any types.
      context: Context<ThunkType<any, any>>
      // biome-ignore lint/suspicious/noExplicitAny: state in ContextMap can be any types.
      reducer: Reducer<ClassState<any>, any>
      // biome-ignore lint/suspicious/noExplicitAny: state in ContextMap can be any types.
      theDo: ThunkModule<any, any>
    }
  }
}

export const contextMap: ContextMap = {
  theList: [],
  theMap: {},
}
