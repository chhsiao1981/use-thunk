import type { GetClassState, Thunk } from './action'
import type { Dispatch } from './dispatch'
import type { DispatchFuncMap } from './dispatchFuncMap'
import { genUUID } from './genUUID'
import { type InitParams, init } from './init'
import registerThunk from './registerThunk'
import { remove } from './remove'
import { setData } from './setData'
import { getNode, getRootID, getState } from './states'
import type { ClassState, NodeMeta, NodeState, NodeStateMap, State } from './stateTypes'
import ThunkContext from './ThunkContext'
import type { ThunkModule, ThunkModuleToFunc } from './thunk'
import useThunk, { type UseThunk } from './useThunk'

export {
  registerThunk,
  useThunk,
  ThunkContext,
  type UseThunk,
  type State,
  type NodeState,
  type NodeMeta,
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
  getRootID,
  getNode,
  getState,
  init,
  type InitParams,
  setData,
  remove,
  // type DefaultThunkModuleFuncMap as DefaultReducerModuleFuncMap, // XXX deemphasize default
  // type ReduceMap, // XXX deemphasize reducer
  // createReducer, // XXX deemphasize reducer
  genUUID,
}
