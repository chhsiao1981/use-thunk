import type { GetClassState, Thunk } from './action'
import { addChild } from './addChild'
import { addLink } from './addLink'
import type { AddRelationAction } from './addRelation'
import type { Dispatch } from './dispatch'
import type { DispatchFuncMap } from './dispatchFuncMap'
import { genUUID } from './genUUID'
import { getChildID, getChildIDs, getLinkID, getLinkIDs } from './getRelation'
import { type InitParams, init } from './init'
import { remove } from './remove'
import { removeChild } from './removeChild'
import { removeLink } from './removeLink'
import type { RemoveRelationAction } from './removeRelation'
import { setData } from './setData'
import { getNode, getRootID, getState } from './states'
import type { ClassState, NodeMeta, NodeState, NodeStateMap, State } from './stateTypes'
import type { ThunkModule, ThunkModuleToFunc } from './thunk'
import useThunk, { type UseThunk } from './useThunk'

export {
  useThunk,
  type UseThunk,
  // StateType, // XXX for global state
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
  getChildIDs,
  getChildID,
  getLinkIDs,
  getLinkID,
  init,
  type InitParams,
  setData,
  remove,
  addChild,
  removeChild,
  addLink,
  removeLink,
  type AddRelationAction,
  type RemoveRelationAction,
  // type DefaultThunkModuleFuncMap as DefaultReducerModuleFuncMap, // XXX deemphasize default
  // type ReduceMap, // XXX deemphasize reducer
  // createReducer, // XXX deemphasize reducer
  genUUID,
}
