import { init, remove, setDefaultID, update, upsert } from './defaultThunkFuncs'
import registerThunk from './registerThunk'
import {
  getDefaultID,
  getNodeOrNullByModule,
  getStateOrNullByModule,
  type ModuleState,
  type State,
} from './states'
import type { dispatch, get, getModuleState, getOrNull, set, Thunk, ThunkFunc } from './thunk'
import { getMod, ThunkContext } from './thunkContext'
import { doMod, type doModule, type ThunkModule } from './thunkModule'
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
  type ThunkModule,
  type doModule,
}

export {
  // moduleState related
  getMod,
  type ModuleState,
}

export type {
  // thunk function
  ThunkFunc,
}

export {
  // default thunk functions.
  upsert,
  update,
  remove,
  init,
}

/**
 * advanced usage.
 */
export type {
  //   thunk definitions
  getOrNull,
  dispatch,
  getModuleState,
}

export {
  // default thunk functions.
  setDefaultID,
}

export {
  // useThunkModuleState
  useThunkModuleState,
  type UseThunkModuleState,
}

export {
  // module state related.
  getStateOrNullByModule,
  getNodeOrNullByModule,
  getDefaultID,
}

export {
  // genID
  genID,
}
