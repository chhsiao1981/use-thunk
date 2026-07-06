import { init, remove, setDefaultID, update, upsert } from './defaultThunkFuncs'
import registerThunk from './registerThunk'
import {
  getDefaultID,
  getNodeOrNullByModule,
  getStateByModule,
  getStateOrNullByModule,
  type ModuleState,
  type State,
} from './states'
import type { dispatch, get, getModuleState, getOrNull, set, Thunk, ThunkFunc } from './thunk'
import { doMod, type doModule, getMod, type ThunkModule } from './thunkModule'
import { type UseThunk, useThunk } from './useThunk'
import { type CustomGenID, genID } from './utils'

export type {
  // types.
  State,
  ThunkModule,
  ThunkFunc,
  Thunk,
  set,
  get,
}

export {
  // registerThunk / useThunk
  registerThunk,
  useThunk,
}

export {
  // module related
  doMod,
  getMod,
}

export {
  // primitive thunk functions.
  upsert,
  update,
  remove,
  init,
}

export {
  //misc
  genID,
}

/**
 * advanced usage.
 */
export type {
  // types
  //   thunk definitions
  getOrNull,
  dispatch,
  getModuleState,
  // other types
  UseThunk,
  doModule,
  ModuleState,
}

export {
  // default thunk functions.
  setDefaultID,
}

export {
  // module state related.
  getStateByModule,
  getStateOrNullByModule,
  getNodeOrNullByModule,
  getDefaultID,
}

export type {
  // genID
  CustomGenID,
}
