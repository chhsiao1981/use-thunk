import { Dispatch as rDispatch, Reducer as rReducer } from 'react'

declare module 'react-reducer-utils' {
  // rThunk
  export interface rThunk<S, A> {
    (dispatch: Dispatch<A | rThunk<S, A>>, getState: () => S): void
  }

  //State
  export interface State { }

  // NodeState
  export type NodeState<S extends State> = {
    id: string,
    state: S
    _children?: NodeStateRelative | null
    _parent?: Node<any> | null
    _links?: NodeStateRelative | null
  }

  export type StateNodes<S extends State> = {
    [key: string]: NodeState<S>
  }

  // GlobalState
  export type ClassState<S extends State> = {
    myClass: string
    doMe: DispatchedAction<S>
    root?: string
    nodes: StateNodes<S>
  }

  // Thunk
  export type Thunk<S extends State> = rThunk<ClassState<S>, Action<S>>

  // Dispatch
  export type Dispatch<S extends State> = rDispatch<Action<S>>

  // Reducer
  export type Reducer<S extends State> = rReducer<ClassState<S>, Action<S>>

  // BaseAction
  //
  // BaseAction contains only {}-based actions, no thunk-based actions.
  export interface BaseAction<S extends State> {
    myID: string
    type: string
    [key: string]: any
  }

  // Action
  export type Action<S extends State> = Thunk<S> | BaseAction<S>

  // DispatchedAction
  export type DispatchedAction<S extends State> = { [key: string]: (...params: any[]) => void }

  // ActionFunc
  export type ActionFunc<S extends State> = (...params: any[]) => Action<S>

  // ReduceFunc
  export type ReduceFunc<S extends State> = (state: ClassState<S>, action: BaseAction<S>) => ClassState<S>

  // Node
  export type Node<S extends State> = { id?: string, theClass: string, do: DispatchedAction<S> }

  // NodeStateRelative
  type NodeStateRelative = { [relativeClass: string]: { list: string[], do: DispatchedAction<any> } }

  // UseReducerParams
  export type UseReducerParams<S extends State> = {
    default: Reducer<S>
    [key: string]: ActionFunc<S> | Reducer<S>
  }

  // GetState
  export type GetClassState<S extends State> = () => ClassState<S>

  /**********
   * useReducer
   **********/
  export function useReducer<S extends State>(theDo: UseReducerParams<S>): [ClassState<S>, DispatchedAction<S>]

  /*************
   * Reducer
   *************/
  // init
  export type InitParams<S extends State> = {
    myID?: string
    myClass: string
    doMe: DispatchedAction<S>
    parentID?: string
    doParent?: DispatchedAction<S>
    links?: Node<S>[]
    state?: S
  }

  export function init<S extends State>(params: InitParams<S>, myuuidv4?: () => string): Thunk<S>

  function setRoot<S extends State>(myID: string): BaseAction<S>

  // add child
  export function addChild<S extends State>(myID: string, child: Node<any>): BaseAction<S>

  // add link
  export function addLink<S extends State>(myID: string, link: Node<any>, isFromLink = false): Thunk<S>

  // remove
  export function remove<S extends State>(myID: string, isFromParent = false): Thunk<S>

  // remove child
  export function removeChild<S extends State>(myID: string, childID: string, childClass: string, isFromChild = false): Thunk<S>

  // remove link
  export function removeLink<S extends State>(myID: string, linkID: string, linkClass: string, isFromLink = false): Thunk<S>

  // set data
  export function setData<S extends State>(myID: string, data: S): BaseAction<S>

  /*****
   * createReducer
   *****/

  export type ReduceMap<S extends State> = { [key: string]: ReduceFunc<S> }

  function defaultReduceMap_f<S extends State>(): ReduceMap<S>

  export function createReducer<S extends State>(reduceMap?: ReduceMap<S>): Reducer<ClassState<S>, Action<S>>

  /////
  // Getter
  /////

  // getRoot
  export function getRoot<S extends State>(state: ClassState<S>): NodeState<S> | null

  // getRootState
  export function getRootState<S extends State>(state: ClassState<S>): S | null

  // getNodeState
  export function getNodeState<S extends State>(state: ClassState<S>, myID: string): NodeState<S> | null

  // getState
  export function getState<S extends State>(state: ClassState<S>, myID: string): S | null

  // get child ids
  export function getChildIDs<S extends State>(me: NodeState<S>, childClass: string): string[]

  // get child id
  export function getChildID<S extends State>(me: NodeState<S>, childClass: string): string | null

  // get link ids
  export function getLinkIDs<S extends State>(me: NodeState<S>, linkClass: string): string[]

  // get link id
  export function getLinkID<S extends State>(me: NodeState<S>, linkClass: string): string | null

  /////
  // Utils
  /////
  export const _GEN_UUID_STATE

  export function genUUID(myuuidv4?: () => string): string
}
