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
import { DO_MODULE_MAP, doMod, type doModule, type ThunkModule } from './thunkModule'
import { type UseThunk, type UseThunkModuleState, useThunk, useThunkModuleState } from './useThunk'
import { genID } from './utils'

export type {
  // thunk definition.
  Thunk,
  set,
  get,
}

export {
  // registerThunk / useThunk / ThunkContext
  registerThunk,
  useThunk,
  type UseThunk,
  ThunkContext,
}

export type {
  // state related.
  State,
}

export {
  // module related
  doMod,
  DO_MODULE_MAP,
  type ThunkModule,
  type doModule,
}

export type {
  // thunk function
  ThunkFunc,
}

export {
  // default thunk functions.
  upsert,
  remove,
}

export {
  // genID
  genID,
}

/***
 * advanced usage.
 */
export type {
  //   thunk definitions
  getOrNull,
  dispatch,
  getModuleState,
  ModuleState,
}

export {
  // default thunk functions.
  init,
  type InitParams,
  update,
  setDefaultID,
}

export {
  // useThunkModuleState
  useThunkModuleState,
  type UseThunkModuleState,
}

export {
  //   functions.
  getNodeOrNull,
  getDefaultID,
  getState,
  getStateOrNullByModule,
  getStateByModule,
}
