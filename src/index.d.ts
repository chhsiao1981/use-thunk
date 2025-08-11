import type { Dispatch as rDispatch, Reducer as rReducer } from 'react'
import type { ActionOrThunk as rActionOrThunk, Thunk as rThunk } from './thunk-reducer'
export interface State {
  // biome-ignore lint/suspicious/noExplicitAny: type in State can be any.
  [key: string]: any
}
export interface BaseAction {
  myID: string
  type: string
  // biome-ignore lint/suspicious/noExplicitAny: type in BaseAction can be any.
  [key: string]: any
}
export type NodeState<S extends State, ParentState extends State = S> = {
  id: string
  state: S
  _children?: NodeStateRelative | null
  _parent?: Node<ParentState> | null
  _links?: NodeStateRelative | null
}
export type NodeStateMap<S extends State> = {
  [key: string]: NodeState<S>
}
export type ClassState<S extends State> = {
  myClass: string
  doMe?: DispatchFuncMap
  root?: string | null
  nodes: NodeStateMap<S>
}
export type Thunk<S extends State> = rThunk<ClassState<S>, BaseAction>
export type ActionOrThunk<S extends State> = rActionOrThunk<ClassState<S>, BaseAction>
export type Dispatch<S extends State> = rDispatch<ActionOrThunk<S>>
export type Reducer<S extends State> = rReducer<ClassState<S>, BaseAction>
export type DispatchFuncMap = {
  [key: string]: (...params: any[]) => void
}
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>
export type ReduceFunc<S extends State> = (state: ClassState<S>, action: BaseAction) => ClassState<S>
export type Node<S extends State> = {
  id: string
  theClass: string
  do: DispatchFuncMap
}
type NodeStateRelative = {
  [relativeClass: string]: {
    list: string[]
    do: DispatchFuncMap
  }
}
export type ReducerModule<S extends State> = {
  default: Reducer<S>
  myClass: string
  defaultState?: S
  [key: string]: ActionFunc<S> | Reducer<S> | string | S | undefined
}
export type GetClassState<S extends State> = () => ClassState<S>
export type InitParams<S extends State> = {
  myID?: string
  parentID?: string
  doParent?: DispatchFuncMap
  state?: S
}
/**********
 * useReducer
 **********/
export declare const useReducer: <S extends State>(theDo: ReducerModule<S>) => [ClassState<S>, DispatchFuncMap]
/*************
 * Reducer Default Functions
 *************/
/*****
 * init
 *****/
/***
 * init
 * params: myClass
 *         doMe
 *         parentID
 *         doParent
 *         links: [{id, myClass, do}]
 *         ...params
 */
export declare const init: <S extends State>(params: InitParams<S>, myuuidv4?: () => string) => Thunk<S>
export declare const addChild: <ChildState extends State>(myID: string, child: Node<ChildState>) => BaseAction
/***
 * addLink
 */
export declare const addLink: <S extends State, LinkState extends State = S>(
  myID: string,
  link: Node<LinkState>,
  isFromLink?: boolean,
) => Thunk<S>
/*****
 * remove
 *****/
/***
 * remove
 * params: myID
 *         isFromParent
 */
export declare const remove: <S extends State>(myID: string, isFromParent?: boolean) => Thunk<S>
/***
 * remove-child
 */
export declare const removeChild: <S extends State>(
  myID: string,
  childID: string,
  childClass: string,
  isFromChild?: boolean,
) => Thunk<S>
/***
 * remove-link
 */
export declare const removeLink: <S extends State>(
  myID: string,
  linkID: string,
  linkClass: string,
  isFromLink?: boolean,
) => Thunk<S>
export declare const setData: <S extends State>(myID: string, data: S) => BaseAction
/*****
 * createReducer
 *****/
export type ReduceMap<S extends State> = {
  [key: string]: ReduceFunc<S>
}
/***
 * createReducer
 * params: reduceMap
 */
export declare const createReducer: <S extends State>(reduceMap?: ReduceMap<S>) => Reducer<S>
/***
 * Retrieving state
 ***/
export declare const getRootNode: <S extends State>(state: ClassState<S>) => NodeState<S> | null
export declare const getRootID: <S extends State>(state: ClassState<S>) => string
export declare const getRoot: <S extends State>(state: ClassState<S>) => S | null
export declare const getNode: <S extends State>(state: ClassState<S>, myID: string) => NodeState<S> | null
export declare const getState: <S extends State>(state: ClassState<S>, myID: string) => S | null
export declare const getChildIDs: <S extends State>(me: NodeState<S>, childClass: string) => string[]
export declare const getChildID: <S extends State>(me: NodeState<S>, childClass: string) => string
export declare const getLinkIDs: <S extends State>(me: NodeState<S>, linkClass: string) => string[]
export declare const getLinkID: <S extends State>(me: NodeState<S>, linkClass: string) => string
export declare const genUUID: (myuuidv4?: () => string) => string
