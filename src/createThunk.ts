import { createContext, type Dispatch, type SetStateAction } from 'react'
import { createThunk } from '.'
import type { ModuleState, State } from './stateTypes'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'
import type { ThunkModule } from './thunkModule'

export default <S extends State>(theDo: ThunkModule<S>) => {
  const { name: propsName, myClass, defaultState } = theDo
  const name = (propsName ? propsName : myClass) || ''

  if (THUNK_CONTEXT_MAP.theMap[name]) {
    console.warn('createThunk: already init:', name)
    return
  }

  const moduleState: ModuleState<S> = { myClass, name, nodes: {}, defaultState }
  const setModuleState: Dispatch<SetStateAction<ModuleState<S>>> = () => {}
  const refModuleState = { current: moduleState }
  const context = createContext({ refModuleState: refModuleState, setModuleState })

  THUNK_CONTEXT_MAP.theMap[name] = { context, refModuleState }
  const theList = Object.keys(THUNK_CONTEXT_MAP.theMap).sort()
  THUNK_CONTEXT_MAP.theList = theList

  console.info('createThunk: done:', name)
}

export const registerThunk = <S extends State>(theDo: ThunkModule<S>) => {
  console.warn('registerThunk will be deprecated in the next version.')
  return createThunk(theDo)
}
