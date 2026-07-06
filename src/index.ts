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
  // thunk definition.
  Thunk,
  set,
  get,
}

export {
  // registerThunk / useThunk
  registerThunk,
  useThunk,
  type UseThunk,
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
  // module state related.
  getStateByModule,
  getStateOrNullByModule,
  getNodeOrNullByModule,
  getDefaultID,
}

export {
  // genID
  type CustomGenID,
  genID,
}
