import type { GetClassState, Thunk } from './action'
import type { Dispatch } from './dispatch'
import type { DispatchFuncMap } from './dispatchFuncMap'
import { genUUID } from './genUUID'
import { type InitParams, init } from './init'
import createThunk, { registerThunk } from './createThunk'
import { remove } from './remove'
import { setDefaultID } from './setDefaultID'
import { getDefaultID, getNode, getState, mustGetState, mustGetStateByThunk } from './states'
import type { ClassState, NodeState, NodeStateMap, State } from './stateTypes'
import ThunkContext from './ThunkContext'
import type { ThunkModule, ThunkModuleToFunc } from './thunk'
import { setData, update } from './update'
import useThunk, { type UseThunk } from './useThunk'

export {
  createThunk,
  registerThunk,
  useThunk,
  ThunkContext,
  type UseThunk,
  type State,
  type NodeState,
  type NodeStateMap,
  // type NodeStateMapByClass, // XXX for global state
  type ClassState,
  type GetClassState,
  // type BaseAction, // XXX deemphasize action
  type Thunk,
  // type ActionOrThunk, // XXX deemphasize action
  // type ActionFunc, // XXX deemphasize action
  // type Reducer, // XXX deemphasize reducer
  type ThunkModule,
  type ThunkModuleToFunc,
  // type ReduceFunc, // XXX deemphasize reducer
  type Dispatch,
  type DispatchFuncMap,
  // type DefaultDispatchFuncMap, // XXX deemphasize default
  getDefaultID,
  getNode,
  getState,
  mustGetState,
  mustGetStateByThunk,
  init,
  type InitParams,
  setData,
  update,
  remove,
  // type DefaultThunkModuleFuncMap as DefaultReducerModuleFuncMap, // XXX deemphasize default
  // type ReduceMap, // XXX deemphasize reducer
  // createReducer, // XXX deemphasize reducer
  setDefaultID,
  genUUID,
}
