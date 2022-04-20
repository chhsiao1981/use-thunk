import React from 'react' // for Empty
import { Dispatch, Reducer as rReducer } from 'react'
import useThunkReducer, { Thunk } from 'react-hook-thunk-reducer'
import { v4 as uuidv4 } from 'uuid'

// BaseAction
type baseActionCore = {
    myID: string
    type: string
    [key: string]: any
}
type extractBaseAction<T> = {
    [property in keyof T]: T[property] extends string ? string : any
}
export type BaseAction = extractBaseAction<baseActionCore>

// Action
export type Action = Thunk<State, Action> | BaseAction

// DispatchAction
export type DispatchAction = { [key: string]: (...params: any[]) => void }

// ActionFunc
export type ActionFunc = (...params: any[]) => Action

// ReduceFunc
export type ReduceFunc = (state: State, action: BaseAction) => State

// Node
export type Node = { id: string, theClass: string, do: DispatchAction }

// NodeStateRelative
type NodeStateRelative = { [relativeClass: string]: { list: string[], do: DispatchAction } }

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
export type NodeState = extractNodeState<nodeStateCore>

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
export type State = extractState<stateCore>

// GetState
export type GetState = () => State

/**********
 * useActionDispatcherReducer
 **********/
type useActionDispatchReducerParamsCore = {
    default: rReducer<State, Action>
    [key: string]: rReducer<State, Action> | ActionFunc
}
type extractUseActionDispatchReducerParams<T> = {
    [property in keyof T]: T[property] extends rReducer<State, Action> ? rReducer<State, Action> : ActionFunc
}
export type UseActionDispatchReducerParams = extractUseActionDispatchReducerParams<useActionDispatchReducerParamsCore>
export const useActionDispatchReducer = (action: UseActionDispatchReducerParams): [State, DispatchAction] => {
    const [state, dispatch] = useThunkReducer<State, Action>(action.default, {})

    let boundDispatchAction = Object.keys(action)
        .filter((each) => each !== 'default')
        .reduce((val: DispatchAction, each) => {
            val[each] = (...params: any[]) => dispatch(action[each](...params))
            return val
        }, {})

    return [state, boundDispatchAction]
}

/*************
 * Reducer
 *************/

/*****
 * init
 *****/
/***
 * init
 * params: myID
 *         myClass
 *         doMe
 *         parentID
 *         doParent
 *         links: [{id, myClass, do}]
 *         ...params
 */
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
export type InitParams = extractInitParams<initParams>
export const init = (params: initParams): Thunk<State, Action> => {
    let { myID, myClass, doMe, parentID, doParent, links, ...theRest } = params
    if (!myID) myID = genUUID()

    return (dispatch: Dispatch<Action>, _: GetState) => {
        dispatch(initCore({ myID, myClass, doMe, parentID, doParent, ...theRest }))

        // links
        if (links) {
            links.map((each) => dispatch(addLink(myID, each)))
        }

        // parent or root
        if (parentID) {
            doParent?.addChild(parentID, myID, myClass, doMe)
        } else {
            dispatch(setRoot(myID))
        }
    }
}

const INIT = 'react-reducer-state/INIT'
type initCoreParams = {
    myID: string
    myClass: string
    doMe: DispatchAction
    parentID?: string
    doParent?: DispatchAction
    [key: string]: any
}
type extractInitCoreParams<T> = {
    [property in keyof T]: T[property] extends string ? string : T[property] extends DispatchAction ? DispatchAction : T[property] extends string | undefined ? string | undefined : T[property] extends DispatchAction | undefined ? DispatchAction | undefined : any
}
type InitCoreParams = extractInitCoreParams<initCoreParams>
const initCore = (params: InitCoreParams): BaseAction => {
    const { myID, myClass, doMe, parentID, doParent, ...theRest } = params
    return {
        myID,
        type: INIT,
        myClass,
        doMe,
        parentID,
        doParent,
        ...theRest,
    }
}

const reduceInit = (state: State, action: BaseAction): State => {
    const { myID, myClass, doMe, parentID, doParent, ...params } = action
    let newList = (state.ids || []).concat([myID])
    return Object.assign({}, state, { myClass, doMe, ids: newList, [myID]: { _children: {}, _parent: { id: parentID, theClass: '', do: doParent }, _links: {}, id: myID, ...params } })
}


/***
 * setRoot
 */
const SET_ROOT = 'react-reducer-state/SET_ROOT'
const setRoot = (myID: string): BaseAction => ({
    myID,
    type: SET_ROOT,
})

const reduceSetRoot = (state: State, action: BaseAction): State => {
    const { myID } = action

    return Object.assign({}, state, { root: myID })
}

/***
 * addChild
 */
const ADD_CHILD = 'react-reducer-state/ADD_CHILD'
export const addChild = (myID: string, childID: string, childClass: string, doChild: DispatchAction): BaseAction => ({
    myID,
    type: ADD_CHILD,
    childID,
    childClass,
    doChild,
})

const reduceAddChild = (state: State, action: BaseAction): State => {
    const { myID, childID, childClass, doChild } = action

    if (!state[myID]) {
        return state
    }

    let children = (state[myID] || {})._children || {}
    let childrenByClass = children[childClass] || {}
    let childList = childrenByClass.list || []
    let newIDs = childList.concat([childID])

    state[myID]._children = Object.assign({}, state[myID]._children, { [childClass]: { list: newIDs, do: doChild } })

    state = Object.assign({}, state)

    return state
}


/***
 * addLink
 */
export const addLink = (myID: string, link: Node, isFromLink = false): Thunk<State, Action> => {
    return (dispatch: Dispatch<Action>, getState: GetState) => {
        dispatch(addLinkCore(myID, link))

        if (!isFromLink) { // I connect to the other, would like the other to connect to me as well.
            const { doMe, myClass } = getState()

            link.do.addLink(link.id, { id: myID, theClass: myClass, do: doMe }, true)
        }
    }
}

const ADD_LINK = 'react-reducer-state/ADD_LINK'
const addLinkCore = (myID: string, link: Node): BaseAction => ({
    myID,
    type: ADD_LINK,
    link,
})

const reduceAddLink = (state: State, action: BaseAction): State => {
    const { myID, link } = action
    if (!state[myID]) {
        return state
    }

    const { theClass: linkClass, id: linkID, do: doLink } = link

    let links = (state[myID] || {})._links || {}
    let linksByClass = links[linkClass] || {}
    let linkList = linksByClass.list || []
    let newIDs = linkList.concat([linkID])

    state[myID]._links = Object.assign({}, state[myID]._links, { [linkClass]: { list: newIDs, do: doLink } })

    // shallow-clone state
    state = Object.assign({}, state)

    return state
}

/*****
 * remove
 *****/
/***
 * remove
 * params: myID
 *         isFromParent
 */
export const remove = (myID: string, isFromParent = false): Thunk<State, Action> => {
    return (dispatch: Dispatch<Action>, getState: GetState) => {
        let state = getState()
        const { myClass, [myID]: me } = state

        // parent removes me
        let parentID = me._parent?.id || null
        if (!isFromParent && parentID) {
            let doParent = me._parent?.do
            doParent?.removeChild(parentID, myID, myClass, true)
        }

        // remove children
        let children = me._children || {}
        Object.keys(children).map((eachClass) => {
            let child = children[eachClass]
            child.list.map((eachID) => dispatch(removeChild(myID, eachID, eachClass, false)))
        })

        // remove links
        let links = me._links || {}
        Object.keys(links).map((eachClass) => {
            let link = links[eachClass]
            link.list.map((eachID) => dispatch(removeLink(myID, eachID, eachClass, false)))
        })

        // remove me from myClass list
        dispatch(removeCore(myID))
    }
}

const REMOVE = 'react-reducer-state/REMOVE'
const removeCore = (myID: string) => ({
    myID,
    type: REMOVE,
})

const reduceRemove = (state: State, action: BaseAction): State => {
    const { myID } = action
    if (!state[myID]) {
        return state
    }

    let newIDs = (state['ids'] || []).filter((eachID) => eachID != myID)
    delete state[myID]

    return Object.assign({}, state, { 'ids': newIDs })
}

/***
 * remove-child
 */
export const removeChild = (myID: string, childID: string, childClass: string, isFromChild = false): Thunk<State, Action> => {
    return (dispatch: Dispatch<Action>, getState: GetState) => {
        let relationRemove = (theDo: DispatchAction, relationID: string) => theDo.remove(relationID, true)

        removeRelation(dispatch, getState, myID, childID, childClass, isFromChild, relationRemove, removeChildCore, '_children')
    }
}

const REMOVE_CHILD = 'react-reducer-state/REMOVE_CHILD'
const removeChildCore = (myID: string, childID: string, childClass: string): BaseAction => ({
    myID,
    type: REMOVE_CHILD,
    childID,
    childClass,
})

const reduceRemoveChild = (state: State, action: BaseAction): State => {

    const { myID, childID, childClass } = action

    return reduceRemoveRelation(state, myID, childID, childClass, '_children')
}

/***
 * remove-link
 */
export const removeLink = (myID: string, linkID: string, linkClass: string, isFromLink = false): Thunk<State, Action> => {
    return (dispatch: Dispatch<Action>, getState: GetState) => {
        let myClass = getState().myClass
        let relationRemove = (theDo: DispatchAction, relationID: string) => theDo.removeLink(relationID, myID, myClass, true)
        removeRelation(dispatch, getState, myID, linkID, linkClass, isFromLink, relationRemove, removeLinkCore, '_links')
    }
}

const REMOVE_LINK = 'react-reducer-state/REMOVE_LINK'
const removeLinkCore = (myID: string, linkID: string, linkClass: string): BaseAction => ({
    myID,
    type: REMOVE_LINK,
    linkID,
    linkClass,
})

const reduceRemoveLink = (state: State, action: BaseAction): State => {
    const { myID, linkID, linkClass } = action

    return reduceRemoveRelation(state, myID, linkID, linkClass, '_links')
}

/***
 * remove-relation
 */
type RelationRemove = (theDo: DispatchAction, relationID: string) => void
type RelationRemoveCore = (myID: string, relationID: string, relationClass: string) => BaseAction

const removeRelation = (dispatch: Dispatch<Action>, getState: GetState, myID: string, relationID: string, relationClass: string, isFromRelation: boolean, relationRemove: RelationRemove, relationRemoveCore: RelationRemoveCore, relationName: string) => {
    let me = getState()[myID]
    if (!me) return

    let relation = me[relationName][relationClass] || null
    if (!relation) return

    let newIDs = relation.list.filter((eachID: string) => eachID != relationID)
    if (relation.list.length === newIDs.length) return

    if (!isFromRelation) relationRemove(relation.do, relationID)

    dispatch(relationRemoveCore(myID, relationID, relationClass))
}

const reduceRemoveRelation = (state: State, myID: string, relationID: string, relationClass: string, relationName: string): State => {
    let me = state[myID]
    if (!me) return state

    let relation = me[relationName][relationClass] || null
    if (!relation) return state

    let relationIDs = relation.list || []
    let newIDs = relationIDs.filter((eachID: string) => eachID !== relationID)
    if (relationIDs.length === newIDs.length) return state

    // no need to new me[relationName] or me[relationName][relationClass]
    if (newIDs.length == 0) {
        delete me[relationName][relationClass]
    } else {
        relation.list = newIDs
    }

    state = Object.assign({}, state, { [myID]: Object.assign({}, state[myID]) })

    return state
}

/*****
 * set data
 *****/
/***
 * setData
 * params: myID
 *         data
 */
const SET_DATA = 'react-reducer-state/SET_DATA'
export const setData = (myID: string, data: any): BaseAction => ({
    myID,
    type: SET_DATA,
    data,
})

const reduceSetData = (state: State, action: BaseAction): State => {
    const { myID, data } = action

    let me = state[myID]
    if (!me) return state

    state = Object.assign({}, state, { [myID]: Object.assign({}, me, data) })

    return state
}


/*****
 * createReducer
 *****/

export type BindReduce = { [key: string]: ReduceFunc }

// theReduceMap
const theReduceMap: BindReduce = {
    [INIT]: reduceInit,
    [ADD_CHILD]: reduceAddChild,
    [ADD_LINK]: reduceAddLink,
    [REMOVE]: reduceRemove,
    [REMOVE_CHILD]: reduceRemoveChild,
    [REMOVE_LINK]: reduceRemoveLink,
    [SET_DATA]: reduceSetData,
    [SET_ROOT]: reduceSetRoot,
}

/***
 * createReducer
 * params: reduceMap
 */
export type Reducer = (state: State, action: BaseAction) => State
export const createReducer = (reduceMap?: BindReduce): Reducer => {
    return (state: State, action: BaseAction): State => {
        if (!action) {
            return state
        }

        if (reduceMap && reduceMap[action.type]) {
            return reduceMap[action.type](state, action)
        }

        if (theReduceMap[action.type]) {
            return theReduceMap[action.type](state, action)
        }

        return state
    }
}

/***
 * Retrieving state
 ***/

export const getRoot = (state: State): NodeState | null => {
    let root = state.root || ''
    if (!root) {
        return null
    }
    return state[root]
}

export const getMe = (state: State, myID: string): NodeState | null => {
    return state[myID] || null
}

export const getChildIDs = (me: NodeState, childClass: string): string[] => {
    return ((me._children || {})[childClass] || {}).list || []
}

export const getChildID = (me: NodeState, childClass: string): string | null => {
    let ids = getChildIDs(me, childClass)
    return ids.length ? ids[0] : null
}
export const getLinkIDs = (me: NodeState, linkClass: string): string[] => {
    return ((me._links || {})[linkClass] || {}).list || []
}
export const getLinkID = (me: NodeState, linkClass: string): string | null => {
    let ids = getLinkIDs(me, linkClass)
    return ids.length ? ids[0] : null
}


/***
 * Utils
 ***/
const _GLOBAL_IDS = new Set()

export const genUUID = (): string => {
    let theID = ''
    while (true) {
        theID = uuidv4()
        if (_GLOBAL_IDS.has(theID))
            continue

        _GLOBAL_IDS.add(theID)
        break
    }
    return theID
}

/***
 * Components
 ***/

export const Empty = () => (<div style={{ display: 'none' }}> </div>)
