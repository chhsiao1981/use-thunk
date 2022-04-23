import { Dispatch, Reducer } from 'react'
import useThunkReducer, { Thunk } from 'react-hook-thunk-reducer'
import { v4 as uuidv4 } from 'uuid'

//State
export interface State {}

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

// BaseAction
//
// BaseAction contains only {}-based actions, no thunk-based actions.
export interface BaseAction<S extends State> {
    myID: string
    type: string
    [key: string]: any
}

// ClassAction
export type Action<S extends State> = Thunk<ClassState<S>, Action<S>> | BaseAction<S>

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
export interface UseReducerParams<S extends State> {
    default: Reducer<ClassState<S>, Action<S>>
    [key: string]: ActionFunc<S> | Reducer<ClassState<S>, Action<S>>
}

// GetState
export type GetState<S extends State> = () => ClassState<S>

/**********
 * useReducer
 **********/
export const useReducer = <T extends UseReducerParams<S>, S extends State>(theDo: T): [ClassState<S>, DispatchedAction<S>] => {
    // XXX {} as init state of ClassState<S>
    // @ts-ignore
    const [state, dispatch] = useThunkReducer<ClassState<S>, Action<S>>(theDo.default, {})

    let dispatchedAction = Object.keys(theDo)
        .filter((each) => each !== 'default')
        .reduce((val: DispatchedAction<S>, each): DispatchedAction<S> => {
            // XXX Because default is already filtered, the rest are ActionFunc<S>
            // @ts-ignore
            let action: ActionFunc<S> = theDo[each]
            val[each] = (...params: any[]) => dispatch(action(...params))
            return val
        }, {})

    return [state, dispatchedAction]
}

/*************
 * Reducer
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
export type InitParams<S extends State> = {
    myID?: string
    myClass: string
    doMe: DispatchedAction<S>
    parentID?: string
    doParent?: DispatchedAction<S>
    links?: Node<S>[]
    state?: S
}

export const init = <S extends State, P extends InitParams<S>>(params: P): Thunk<ClassState<S>, Action<S>> => {
    return (dispatch: Dispatch<Action<S>>, _: GetState<S>) => {
        let myID = params.myID || genUUID()

        dispatch(initCore<S, P>(myID, params))

        const { myClass, doMe, parentID, doParent, links } = params

        // links
        if (links) {
            links.map((each) => dispatch(addLink(myID, each)))
        }

        // parent or root
        if (parentID && doParent) {
            doParent.addChild(parentID, { id: myID, theClass: myClass, do: doMe })
        } else {
            dispatch(setRoot(myID))
        }
    }
}

const INIT = 'react-reducer-state/INIT'
const initCore = <S extends State, P extends InitParams<S>>(myID: string, params: P): BaseAction<S> => {
    let { myClass, doMe, parentID, doParent, state } = params
    return {
        myID,
        type: INIT,
        myClass,
        doMe,
        parentID,
        doParent,
        state,
    }
}

const reduceInit = <S extends State>(state: ClassState<S>, action: BaseAction<S>): ClassState<S> => {
    let { myID, myClass, doMe, parentID, doParent, state: theState } = action

    theState = theState || {}

    let me: NodeState<S> = {
        id: myID,
        state: theState,
        _children: {},
        _links: {},
    }
    if (parentID) {
        me._parent = { id: parentID, do: doParent, theClass: '' }
    }

    let newNodes: StateNodes<S> = Object.assign({}, state.nodes, { [myID]: me })
    let newState: ClassState<S> = Object.assign({}, state, { myClass, doMe, nodes: newNodes })
    return newState
}

/***
 * setRoot
 */
const SET_ROOT = 'react-reducer-state/SET_ROOT'
const setRoot = <S extends State>(myID: string): BaseAction<S> => ({
    myID,
    type: SET_ROOT,
})

const reduceSetRoot = <S extends State>(state: ClassState<S>, action: BaseAction<S>): ClassState<S> => {
    const { myID } = action

    return Object.assign({}, state, { root: myID })
}

/***
 * addChild
 */
const ADD_CHILD = 'react-reducer-state/ADD_CHILD'
export const addChild = <S extends State>(myID: string, child: Node<any>): BaseAction<S> => ({
    myID,
    type: ADD_CHILD,
    relative: child,
})

const reduceAddChild = <S extends State>(state: ClassState<S>, action: BaseAction<S>): ClassState<S> => {
    return reduceAddRelative(state, action, '_children')
}


/***
 * addLink
 */
export const addLink = <S extends State>(myID: string, link: Node<any>, isFromLink = false): Thunk<ClassState<S>, Action<S>> => {
    return (dispatch: Dispatch<Action<S>>, getState: GetState<S>) => {
        dispatch(addLinkCore<S>(myID, link))

        if (!isFromLink) { // I connect to the other, would like the other to connect to me as well.
            const { doMe, myClass } = getState()

            link.do.addLink(link.id, { id: myID, theClass: myClass, do: doMe }, true)
        }
    }
}

const ADD_LINK = 'react-reducer-state/ADD_LINK'
const addLinkCore = <S extends State>(myID: string, link: Node<any>): BaseAction<S> => ({
    myID,
    type: ADD_LINK,
    relative: link,
})

const reduceAddLink = <S extends State>(state: ClassState<S>, action: BaseAction<S>): ClassState<S> => {
    return reduceAddRelative(state, action, '_links')
}

const reduceAddRelative = <S extends State>(state: ClassState<S>, action: BaseAction<S>, relativeName: '_links' | '_children'): ClassState<S> => {
    const { myID, relative } = action
    let me = state.nodes[myID]
    if (!me) {
        return state
    }

    const { theClass, id: theID, do: theDo } = relative

    let relatives = me[relativeName] || {}
    let relativesByClass = relatives[theClass] || {}
    let relativeIDs = relativesByClass.list || []
    let newIDs = theID ? relativeIDs.concat([theID]) : relativeIDs

    let newRelatives = Object.assign({}, me[relativeName], { [theClass]: { list: newIDs, do: theDo } })
    let newMe = Object.assign({}, me, { [relativeName]: newRelatives })
    let newNodes = Object.assign({}, state.nodes, { [myID]: newMe })
    let newState = Object.assign({}, state, { nodes: newNodes })

    return newState
}

/*****
 * remove
 *****/
/***
 * remove
 * params: myID
 *         isFromParent
 */
export const remove = <S extends State>(myID: string, isFromParent = false): Thunk<ClassState<S>, Action<S>> => {
    return (dispatch: Dispatch<Action<S>>, getState: GetState<S>) => {
        let state = getState()
        const { myClass, nodes: { [myID]: me } } = state
        if (!me) {
            return
        }

        // parent removes me
        let parent = me._parent
        if (!isFromParent && parent) {
            const { id: parentID, do: doParent } = parent
            if (parentID) {
                doParent.removeChild(parentID, myID, myClass, true)
            }
        }

        // remove children
        let children = me._children
        if (children) {
            let realChildren = children
            Object.keys(realChildren).map((eachClass) => {
                let child = realChildren[eachClass]
                child.list.map((eachID) => dispatch(removeChild(myID, eachID, eachClass, false)))
            })
        }

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
const removeCore = <S extends State>(myID: string): BaseAction<S> => ({
    myID,
    type: REMOVE,
})

const reduceRemove = <S extends State>(state: ClassState<S>, action: BaseAction<S>): ClassState<S> => {
    const { myID } = action

    let me = state.nodes[myID]
    if (!me) {
        return state
    }

    let newNodes = Object.keys(state.nodes)
        .filter((each) => each !== myID)
        .reduce((r: StateNodes<S>, x: string): StateNodes<S> => {
            r[x] = state.nodes[x]
            return r
        }, {})

    // root
    let newState = Object.assign({}, state, { nodes: newNodes })
    if (newState.root === myID) {
        delete newState.root
    }

    return newState
}

/***
 * remove-child
 */
export const removeChild = <S extends State>(myID: string, childID: string, childClass: string, isFromChild = false): Thunk<ClassState<S>, Action<S>> => {
    return (dispatch: Dispatch<Action<S>>, getState: GetState<S>) => {
        let relationRemove = (theDo: DispatchedAction<S>) => theDo.remove(childID, true)

        removeRelation(dispatch, getState, myID, childID, childClass, isFromChild, relationRemove, removeChildCore, '_children')
    }
}

const REMOVE_CHILD = 'react-reducer-state/REMOVE_CHILD'
const removeChildCore = <S extends State>(myID: string, childID: string, childClass: string): BaseAction<S> => ({
    myID,
    type: REMOVE_CHILD,
    childID,
    childClass,
})

const reduceRemoveChild = <S extends State>(state: ClassState<S>, action: BaseAction<S>): ClassState<S> => {

    const { myID, childID, childClass } = action

    return reduceRemoveRelation(state, myID, childID, childClass, '_children')
}

/***
 * remove-link
 */
export const removeLink = <S extends State>(myID: string, linkID: string, linkClass: string, isFromLink = false): Thunk<ClassState<S>, Action<S>> => {
    return (dispatch: Dispatch<Action<S>>, getState: GetState<S>) => {
        let myClass = getState().myClass
        let relationRemove = (theDo: DispatchedAction<S>) => theDo.removeLink(linkID, myID, myClass, true)
        removeRelation(dispatch, getState, myID, linkID, linkClass, isFromLink, relationRemove, removeLinkCore, '_links')
    }
}

const REMOVE_LINK = 'react-reducer-state/REMOVE_LINK'
const removeLinkCore = <S extends State>(myID: string, linkID: string, linkClass: string): BaseAction<S> => ({
    myID,
    type: REMOVE_LINK,
    linkID,
    linkClass,
})

const reduceRemoveLink = <S extends State>(state: ClassState<S>, action: BaseAction<S>): ClassState<S> => {
    const { myID, linkID, linkClass } = action

    return reduceRemoveRelation(state, myID, linkID, linkClass, '_links')
}

/***
 * remove-relation
 */
type RelationRemove<S extends State> = (theDo: DispatchedAction<S>) => void
type RemoveRelationCore<S extends State> = (myID: string, relationID: string, relationClass: string) => BaseAction<S>

const removeRelation = <S extends State>(dispatch: Dispatch<Action<S>>, getState: GetState<S>, myID: string, relationID: string, relationClass: string, isFromRelation: boolean, relationRemove: RelationRemove<any>, removeRelationCore: RemoveRelationCore<S>, relationName: '_links' | '_children') => {
    let state = getState()
    let me = state.nodes[myID]
    if (!me) {
        return
    }

    let relation = me[relationName]
    if (!relation) {
        return
    }
    let relationByClass = relation[relationClass]
    if (!relationByClass) {
        return
    }

    let newIDs = relationByClass.list.filter((eachID: string) => eachID !== relationID)
    if (relationByClass.list.length === newIDs.length) return

    if (!isFromRelation) {
        relationRemove(relationByClass.do)
    }

    dispatch(removeRelationCore(myID, relationID, relationClass))
}

const reduceRemoveRelation = <S extends State>(state: ClassState<S>, myID: string, relationID: string, relationClass: string, relationName: '_links' | '_children'): ClassState<S> => {
    let me = state.nodes[myID]
    if (!me) return state

    let relation = me[relationName]
    if (!relation) return state

    let relationByClass = relation[relationClass]
    if (!relationByClass) return state

    let relationIDs = relationByClass.list || []
    let newIDs = relationIDs.filter((eachID: string) => eachID !== relationID)
    if (relationIDs.length === newIDs.length) return state

    let newRelation = Object.assign({}, relation)
    if (newIDs.length == 0) {
        delete newRelation[relationClass]
    } else {
        let newRelationByClass = Object.assign({}, relationByClass, { list: newIDs })
        newRelation[relationClass] = newRelationByClass
    }

    let newMe = Object.assign({}, me, { [relationName]: newRelation })
    let newNodes = Object.assign({}, state.nodes, { [myID]: newMe })
    let newState = Object.assign({}, state, { nodes: newNodes })

    return newState
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
export const setData = <S extends State>(myID: string, data: any): BaseAction<S> => ({
    myID,
    type: SET_DATA,
    data,
})

const reduceSetData = <S extends State>(state: ClassState<S>, action: BaseAction<S>): ClassState<S> => {
    const { myID, data } = action

    let me = state.nodes[myID]
    if (!me) return state

    let newMyState = Object.assign({}, me.state, data)
    let newMe = Object.assign({}, me, { state: newMyState })
    let newNodes = Object.assign({}, state.nodes, { [myID]: newMe })
    let newState = Object.assign({}, state, { nodes: newNodes })

    return newState
}


/*****
 * createReducer
 *****/

export type ReduceMap<S extends State> = { [key: string]: ReduceFunc<S> }

// theReduceMap
const defaultReduceMap_f = <S extends State>(): ReduceMap<S> => ({
    [INIT]: reduceInit,
    [ADD_CHILD]: reduceAddChild,
    [ADD_LINK]: reduceAddLink,
    [REMOVE]: reduceRemove,
    [REMOVE_CHILD]: reduceRemoveChild,
    [REMOVE_LINK]: reduceRemoveLink,
    [SET_DATA]: reduceSetData,
    [SET_ROOT]: reduceSetRoot,
})

/***
 * createReducer
 * params: reduceMap
 */
export const createReducer = <S extends State>(reduceMap?: ReduceMap<S>): Reducer<ClassState<S>, Action<S>> => {
    return (state: ClassState<S>, action: Action<S>): ClassState<S> => {
        if (!action) {
            return state
        }

        // XXX All the action in reduceMap are BaseAction
        // @ts-ignore
        if (reduceMap && reduceMap[action.type]) {
            // XXX All the action in reduceMap are BaseAction
            // @ts-ignore
            return reduceMap[action.type](state, action)
        }

        let defaultReduceMap = defaultReduceMap_f<S>()
        // XXX All the action in defaultReduceMap are BaseAction
        // @ts-ignore
        if (defaultReduceMap[action.type]) {
            // XXX All the action in defaultReduceMap are BaseAction
            // @ts-ignore
            return defaultReduceMap[action.type](state, action)
        }

        return state
    }
}

/***
 * Retrieving state
 ***/

export const getRoot = <S extends State>(state: ClassState<S>): NodeState<S> | null => {
    let root = state.root
    if (!root) {
        return null
    }
    return state.nodes[root]
}

export const getMe = <S extends State>(state: ClassState<S>, myID: string): NodeState<S> | null => {
    return state.nodes[myID] || null
}

export const getChildIDs = <S extends State>(me: NodeState<S>, childClass: string): string[] => {
    return getRelativeIDs<S>(me, childClass, '_children')
}

const getRelativeIDs = <S extends State>(me: NodeState<S>, relativeClass: string, relativeName: '_links' | '_children'): string[] => {
    let relatives = me[relativeName]
    if (!relatives) {
        return []
    }
    let relativesByClass = relatives[relativeClass]
    if (!relativesByClass) {
        return []
    }

    return relativesByClass.list
}

export const getChildID = <S extends State>(me: NodeState<S>, childClass: string): string | null => {
    return getRelativeID<S>(me, childClass, '_children')
}

const getRelativeID = <S extends State>(me: NodeState<S>, relativeClass: string, relativeName: '_links' | '_children'): string | null => {
    let ids = getRelativeIDs<S>(me, relativeClass, relativeName)
    return ids.length ? ids[0] : null
}

export const getLinkIDs = <S extends State>(me: NodeState<S>, linkClass: string): string[] => {
    return getRelativeIDs<S>(me, linkClass, '_links')
}

export const getLinkID = <S extends State>(me: NodeState<S>, linkClass: string): string | null => {
    return getRelativeID<S>(me, linkClass, '_links')

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
