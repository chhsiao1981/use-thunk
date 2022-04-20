import { JSX, Dispatch, Reducer } from 'react'
import { Thunk } from 'react-hook-thunk-reducer'

declare module 'react-reducer-utils' {
    export type BaseAction = extractBaseAction<baseActionCore>
    export type Action = Thunk<State, Action> | BaseAction
    export type DispatchAction = { [key: string]: (...params: any[]) => void }

    export type ActionFunc = (...params: any[]) => Action

    export type ReduceFunc = (state: State, action: BaseAction) => State

    export type BindReduce = { [key: string]: ReduceFunc }

    // Node / NodeState / State / GetState
    export type Node = { id: string, theClass: string, do: DispatchAction }
    export type NodeState = extractNodeState<nodeStateCore>
    export type State = extractState<stateCore>
    export type GetState = () => State

    // useActionDispatchReducer
    export type UseActionDispatchReducerParams = extractUseActionDispatchReducerParams<useActionDispatchReducerParamsCore>
    export function useActionDispatchReducer(action: UseActionDispatchReducerParams): [State, DispatchAction]

    // init
    export type InitParams = extractInitParams<initParams>
    export function init(params: initParams): Thunk<State, Action>

    // add child
    export function addChild(myID: string, childID: string, childClass: string, doChild: DispatchAction): BaseAction
    // add link
    export function addLink(myID: string, link: Node, isFromLink = false): Thunk<State, Action>
    // remove
    export function remove(myID: string, isFromParent = false): Thunk<State, Action>
    // remove child
    export function removeChild(myID: string, childID: string, childClass: string, isFromChild = false): Thunk<State, Action>
    // remove link
    export function removeLink(myID: string, linkID: string, linkClass: string, isFromLink = false): Thunk<State, Action>
    // set data
    export function setData(myID: string, data: any): BaseAction

    // create reducer
    export type Reducer = (state: State, action: BaseAction) => State
    export function createReducer(reduceMap?: BindReduce): CreateReducer

    /////
    // Getter
    /////

    // getRoot
    export function getRoot(state: State): NodeState | null
    // getMe
    export function getMe(state: State, myID: string): NodeState | null
    // get child ids
    export function getChildIDs(me: NodeState, childClass: string): string[]
    // get child id
    export function getChildID(me: NodeState, childClass: string): string | null
    // get link ids
    export function getLinkIDs(me: NodeState, linkClass: string): string[]
    // get link id
    export function getLinkID(me: NodeState, linkClass: string): string | null

    /////
    // Utils
    /////
    export function genUUID(): string

    /////
    // Components
    /////
    export const Empty = () => JSX.Element

    //////////
    // assistant types
    //////////
    // BaseAction
    type baseActionCore = {
        myID: string
        type: string
        [key: string]: any
    }
    type extractBaseAction<T> = {
        [property in keyof T]: T[property] extends string ? string : any
    }

    // NodeState
    type nodeStateCore = {
        _children: NodeStateRelative | null
        _parent: Node | null
        _links: NodeStateRelative | null
        id: string
        [key: string]: any
    }
    type extractNodeState<T> = {
        [property in keyof T]: T[property] extends NodeStateRelative | null ? NodeStateRelative | null : T[property] extends Node | null ? Node | null : T[property] extends string | null ? string | null : any
    }

    // State
    type stateCore = {
        myClass?: string
        doMe?: DispatchAction
        ids?: string[]
        root?: string
        [key: string]: string | DispatchAction | string[] | NodeState | undefined
    }
    type extractState<T> = {
        [property in keyof T]: T[property] extends string | undefined ? string | undefined : T[property] extends DispatchAction | undefined ? DispatchAction | undefined : T[property] extends string[] | undefined ? string[] | undefined : NodeState
    }

    // UseActionDispatchReducerParams
    type useActionDispatchReducerParamsCore = {
        default: Reducer<State, Action>
        [key: string]: Reducer<State, Action> | ActionFunc
    }
    type extractUseActionDispatchReducerParams<T> = {
        [property in keyof T]: T[property] extends Reducer<State, Action> ? Reducer<State, Action> : ActionFunc
    }

    // InitParams
    type initParams = {
        myID: string
        myClass: string
        doMe: DispatchAction
        parentID?: string
        doParent?: DispatchAction
        links?: Node[]
        [key: string]: any
    }
    type extractInitParams<T> = {
        [property in keyof T]: T[property] extends string ? string : T[property] extends DispatchAction ? DispatchAction : T[property] extends string | undefined ? string | undefined : T[property] extends DispatchAction | undefined ? DispatchAction | undefined : T[property] extends Node[] | undefined ? Node[] | undefined : any
    }
}