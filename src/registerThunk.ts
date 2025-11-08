import { createContext } from 'react'
import { contextMap } from './contextMap'
import { createReducer } from './createReducer'
import type { State } from './stateTypes'
import type { ThunkModule, ThunkModuleFunc, ThunkType } from './thunkTypes'

export default <S extends State, R extends ThunkModuleFunc<S>>(theDo: ThunkModule<S, R>) => {
  if (contextMap.hasOwnProperty(theDo.myClass)) {
    console.warn('Thunk already registered:', theDo.myClass)
    return
  }

  // biome-ignore lint/suspicious/noExplicitAny: action can be any types in init.
  const value: ThunkType<S, any> = {
    classState: { myClass: theDo.myClass, nodes: {} },
    dispatchMap: {},
  }
  const theContext = createContext(value)
  contextMap.theMap[theDo.myClass] = {
    context: theContext,
    reducer: theDo.default ?? createReducer<S>(),
    theDo,
  }
  contextMap.theList.push(theDo.myClass)
}
