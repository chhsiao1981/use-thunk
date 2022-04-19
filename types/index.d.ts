import { Thunk } from 'react-hook-thunk-reducer'
import React from 'react'

declare module 'react-reducer-utils' {
    export type State = object
    export type Action = object | Thunk<State, Action>
    export type DispatchAction = { [key: string]: (...params: any[]) => void }

    type BindAction = { [key: string]: Action }
    type CreateReducer<S, A> = (state: S, action: A) => S

    export const useActionDispatchReducer: (action: BindAction) => [object, DispatchAction]
    export const init: (obj: object) => Thunk<object, Action>
    export const addChild: (myID: string, childID: string, childClass: string, doChild: DispatchAction) => Action
    export const addLink: (myID: string, link: string, isFromLink?: boolean) => Thunk<object, Action>
    export const remove: (myID: string, isFromParent?: boolean) => Thunk<object, Action>
    export const removeChild: (myID: string, childID: string, childClass: string, isFromChild?: boolean) => Thunk<object, Action>
    export const removeLink: (myID: string, linkID: string, linkClass: string, isFromLink?: boolean) => Thunk<object, Action>
    export const setData: (myID: string, data: object) => Action
    export const createReducer: (reduceMap?: BindAction) => CreateReducer<object, Action>

    export const getRoot: () => State
    export const getMe: (state: State, myID: string) => State
    export const getChildIDs: (me: State, childClass: string) => string[]
    export const getChildID: (me: State, childClass: string) => string
    export const getLinkIDs: (me: State, linkClass: string) => string[]
    export const getLinkID: (me: State, linkClass: string) => string
    export const geUUID: () => string

    export const Empty: () => React.ReactNode
}
