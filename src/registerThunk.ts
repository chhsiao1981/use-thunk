// Reason for registerThunk instead of createThunk:
//   I feel that createThunk needs to return some object
//   as the proof of successful creation.
//   However, we register Thunks to the global state management
//   system and return void.
import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { ModuleState, State } from './states'
import type { Context } from './thunkContext'
import { THUNK_CONTEXT_MAP } from './thunkContext'
import type { ThunkModule } from './thunkModule'

export default <S extends State>(module: ThunkModule<S>) => {
  const { name, defaultState } = module

  if (THUNK_CONTEXT_MAP.theMap[name]) {
    console.warn('registerThunk: already init:', name)
    return
  }

  const initModuleState: ModuleState<S> = { name: module.name, nodes: {}, defaultState }
  const setModuleState: Dispatch<SetStateAction<ModuleState<S>>> = () => {}
  const context = createContext<Context<S>>({ moduleState: initModuleState, setModuleState })

  THUNK_CONTEXT_MAP.theMap[name] = { context, initModuleState }
  const theList = Object.keys(THUNK_CONTEXT_MAP.theMap).sort()
  THUNK_CONTEXT_MAP.theList = theList

  console.info('registerThunk: done:', name)
}
