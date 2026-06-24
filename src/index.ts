import { type InitParams, init, remove, setDefaultID, update, upsert } from './defaultThunkFuncs'
import registerThunk from './registerThunk'
import {
  getDefaultID,
  getNodeOrNull,
  getState,
  getStateByModule,
  getStateOrNullByModule,
  type ModuleState,
  type State,
} from './states'
import type { dispatch, get, getModuleState, getOrNull, set, Thunk, ThunkFunc } from './thunk'
import { ThunkContext } from './thunkContext'
import type { doModule, ThunkModule } from './thunkModule'
import useThunk, { type UseThunk } from './useThunk'
import { genID } from './utils'

export {
  // thunk definition.
  type Thunk,
  type set,
  type get,
  // registerThunk / useThunk / ThunkContext
  registerThunk,
  useThunk,
  type UseThunk,
  ThunkContext,
  // state related.
  type State,
  getState,
  type ModuleState,
  // module related.
  type ThunkModule,
  type ThunkFunc,
  type doModule,
  // default thunk functions.
  init,
  type InitParams,
  update,
  upsert,
  remove,
  // genID
  genID,
  // advanced usage.
  //   thunk definitions
  type getOrNull,
  type dispatch,
  type getModuleState,
  //   functions.
  setDefaultID,
  getNodeOrNull,
  getDefaultID,
  getStateOrNullByModule,
  getStateByModule,
}
