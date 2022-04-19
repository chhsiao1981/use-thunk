import { Thunk } from 'react-hook-thunk-reducer'
import React from 'react'

declare module 'react-reducer-utils' {
    export type State = object
    export type Action = object | Thunk<State, Action>
    export type DispatchAction = { [key: string]: (...params: any[]) => void }

    type BindAction = { [key: string]: Action }
    type Reducer<S, A> = (state: S, action: A) => S

    export const useActionDispatchReducer: (action: Reducer<State, Action>) => [State, DispatchAction]
    export const init: (obj: object) => Thunk<State, Action>
    export const addChild: (myID: string, childID: string, childClass: string, doChild: Reducer<State, Action>) => Action
    export const addLink: (myID: string, link: string, isFromLink?: boolean) => Thunk<State, Action>
    export const remove: (myID: string, isFromParent?: boolean) => Thunk<State, Action>
    export const removeChild: (myID: string, childID: string, childClass: string, isFromChild?: boolean) => Thunk<State, Action>
    export const removeLink: (myID: string, linkID: string, linkClass: string, isFromLink?: boolean) => Thunk<State, Action>
    export const setData: (myID: string, data: object) => Action
    export const createReducer: (reduceMap?: BindAction) => Reducer<State, Action>

    export const getRoot: (state: State) => State
    export const getMe: (state: State, myID: string) => State
    export const getChildIDs: (me: State, childClass: string) => string[]
    export const getChildID: (me: State, childClass: string) => string
    export const getLinkIDs: (me: State, linkClass: string) => string[]
    export const getLinkID: (me: State, linkClass: string) => string
    export const genUUID: () => string

    export const Empty: () => React.ReactNode
}
