// Reason for registerThunk instead of createThunk:
//   I feel that createThunk needs to return some object
//   as the proof of successful creation.
//   However, we register Thunks to the global state management
//   system and return void.
import type { ModuleState, State } from './states'
import { THUNK_CONTEXT_MAP } from './thunkContext'
import type { ThunkModule } from './thunkModule'

/**
 * register a thunk module.
 *
 * @param module thunk module.
 * @returns
 */
const registerThunk = <S extends State>(module: ThunkModule<S>) => {
  const { name, defaultState } = module

  if (THUNK_CONTEXT_MAP.theMap[name]) {
    console.warn('registerThunk: already init:', name)
    return
  }

  const moduleState: ModuleState<S> = {
    name: module.name,
    nodes: {},
    defaultState,
    subscribes: {},
  }
  THUNK_CONTEXT_MAP.theMap[name] = { moduleState }

  console.info('registerThunk: done:', name)
}

export default registerThunk
