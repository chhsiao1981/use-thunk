import {
  init,
  remove,
  setDefaultID,
  update,
  upsert,
} from "./defaultThunkFuncs";
import registerThunk from "./registerThunk";
import {
  getDefaultID,
  getNodeOrNullByModule,
  getStateByModule,
  getStateOrNullByModule,
  type ModuleState,
  type State,
} from "./states";
import type {
  dispatch,
  get,
  getModuleState,
  getOrNull,
  set,
  Thunk,
  ThunkFunc,
} from "./thunk";
import { doMod, type doModule, getMod, type ThunkModule } from "./thunkModule";
import { type UseThunk, useThunk } from "./useThunk";
import { type CustomGenID, genID } from "./utils";

/**
 * advanced usage.
 */
export type {
  // genID
  CustomGenID,
  dispatch,
  doModule,
  get,
  getModuleState,
  // types
  //   thunk definitions
  getOrNull,
  ModuleState,
  // types.
  State,
  set,
  Thunk,
  ThunkFunc,
  ThunkModule,
  // other types
  UseThunk,
};
export {
  // module related
  doMod,
  //misc
  genID,
  getDefaultID,
  getMod,
  getNodeOrNullByModule,
  // module state related.
  getStateByModule,
  getStateOrNullByModule,
  init,
  // registerThunk / useThunk
  registerThunk,
  remove,
  // default thunk functions.
  setDefaultID,
  update,
  // primitive thunk functions.
  upsert,
  useThunk,
};
