import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { ModuleState, State } from './stateTypes'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'
import type { ThunkModule } from './thunkModule'

export default <S extends State>(theDo: ThunkModule<S>) => {
  const { name, defaultState } = theDo

  if (THUNK_CONTEXT_MAP.theMap[name]) {
    console.warn('createThunk: already init:', name)
    return
  }

  const moduleState: ModuleState<S> = { name, nodes: {}, defaultState }
  const setModuleState: Dispatch<SetStateAction<ModuleState<S>>> = () => {}
  const refModuleState = { current: moduleState }
  const context = createContext({ refModuleState: refModuleState, setModuleState })

  THUNK_CONTEXT_MAP.theMap[name] = { context, refModuleState }
  const theList = Object.keys(THUNK_CONTEXT_MAP.theMap).sort()
  THUNK_CONTEXT_MAP.theList = theList

  console.info('createThunk: done:', name)
}
