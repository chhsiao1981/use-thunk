// Reason for registerThunk instead of createThunk:
//   I feel that createThunk needs to return some object
//   as the proof of successful creation.
//   However, we register Thunks to the global state management
//   system and return void.
import { RESERVE_THUNK_FUNC_MAPS } from './defaultThunkFuncs/defaultThunkFuncMap'
import type { ModuleState, State } from './states'
import { THUNK_CONTEXT_MAP } from './thunkContext'
import type { ThunkModule } from './thunkModule'

/**
 * register a thunk module.
 *
 * @param module thunk module.
 * @param isIDBased is id-based module. for performance gain by not checking default-id in set/disptch.
 * @returns
 */
const registerThunk = <S extends State>(module: ThunkModule<S>, isIDBased: boolean = false) => {
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
    isIDBased,
  }
  THUNK_CONTEXT_MAP.theMap[name] = { moduleState }

  // check RESERVE_THUNK_FUNC_MAP
  // biome-ignore lint/suspicious/useIterableCallbackReturn: return void.
  RESERVE_THUNK_FUNC_MAPS.map((each) => {
    if (module[each]) {
      console.error(
        `RESERVED THUNK FUNC (${name}): ${each} is a reserved thunk function. please rename to other name`,
      )
    }
  })

  console.info('registerThunk: done:', name)
}

export default registerThunk
