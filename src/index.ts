import { type Dispatch as rDispatch, type Reducer as rReducer, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useThunkReducer, { type ActionOrThunk as rActionOrThunk, type Thunk as rThunk } from './thunk-reducer'

//State
export interface State {
  [key: string]: unknown
}

// BaseAction
//
// BaseAction contains only object-based actions, no thunk-based actions.
export interface BaseAction {
  myID: string
  type: string
  [key: string]: unknown
}

// NodeState
export interface NodeState<S extends State> {
  id: string
  state: S
  [Relation.CHILDREN]?: NodeStateRelative | null
  [PARENT]?: NodeMeta | null
  [Relation.LINKS]?: NodeStateRelative | null
}

export interface NodeStateMap<S extends State> {
  [key: string]: NodeState<S>
}

// ClassState
export interface ClassState<S extends State> {
  myClass: string
  root?: string | null
  // XXX doMe is a hidden variable for ClassState
  //     used only for parents / children / links.
  // doMe: DispatchFuncMap
  nodes: NodeStateMap<S>
}

// Thunk
export type Thunk<S extends State> = rThunk<ClassState<S>, BaseAction>

export type ActionOrThunk<S extends State> = rActionOrThunk<ClassState<S>, BaseAction>

// Dispatch
export type Dispatch<S extends State> = rDispatch<ActionOrThunk<S>>

// Reducer
export type Reducer<S extends State> = rReducer<ClassState<S>, BaseAction>

// ReducerModule
// This is used as the parameter for useReducer.
export type ReducerModule<S extends State, R extends ReducerModuleFunc<S>> = {
  myClass: string
  default?: Reducer<S>
  defaultState?: S
} & R

export type ModuleToFunc<T> = Omit<T, 'myClass' | 'default' | 'defaultState'>

interface ReducerModuleFunc<S extends State> {
  [action: string]: ActionFunc<S>
}

type VoidReturnType<T extends (...params: any[]) => any> = (...params: Parameters<T>) => void

export type DispatchFuncMap<S extends State, R extends ReducerModuleFunc<S>> = {
  [action in keyof R]: VoidReturnType<R[action]>
} & Omit<DefaultDispatchFuncMap, keyof R>

export type DefaultDispatchFuncMap = {
  [action in keyof DefaultReducerModuleFunc]: VoidReturnType<DefaultReducerModuleFunc[action]>
}

interface DispatchFuncMapByClassMap<S extends State, R extends ReducerModuleFunc<S>> {
  [className: string]: DispatchFuncMap<S, R>
}

interface RefDispatchFuncMapByClassMap<S extends State, R extends ReducerModuleFunc<S>> {
  current: DispatchFuncMapByClassMap<S, R>
}

// ActionFunc
// biome-ignore lint/suspicious/noExplicitAny: unknown requires same type in list. use any for possible different types.
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>

// ReduceFunc
export type ReduceFunc<S extends State> = (state: ClassState<S>, action: BaseAction) => ClassState<S>

// Node
export type NodeMeta = {
  id: string
  theClass: string
  // @ts-expect-error do can be any type.
  do: DispatchFuncMap
}

// NodeStateRelative
type NodeStateRelative = {
  [relativeClass: string]: {
    list: string[]
    // @ts-expect-error do can be any type.
    do: DispatchFuncMap
  }
}

// GetClassState
export type GetClassState<S extends State> = () => ClassState<S>

// InitParams
export interface InitParams<S extends State> {
  myID?: string
  parentID?: string
  // @ts-expect-error doParent can be any type.
  doParent?: DispatchFuncMap
  parentClass?: string

  state: S
}

export interface AddRelativeAction extends BaseAction {
  relative: NodeMeta
}

export interface RemoveRelativeAction extends BaseAction {
  relationID: string
  relationClass: string
}

enum Relation {
  CHILDREN = '_children',
  LINKS = '_links',
}

const PARENT = '_parent'

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
export const init = <S extends State>(params: InitParams<S>, myuuidv4?: () => string): Thunk<S> => {
  return (dispatch, getClassState) => {
    const myID = params.myID ?? genUUID(myuuidv4)

    const { parentID, doParent, parentClass, state } = params
    dispatch(initCore(myID, state, parentID, doParent, parentClass))

    // @ts-expect-error XXX doMe is a hidden variable for children.
    const { myClass, doMe, root } = getClassState()

    // parent or root
    if (parentID && doParent) {
      doParent.addChild(parentID, { id: myID, theClass: myClass, do: doMe })
    } else if (!root) {
      dispatch(setRoot(myID))
    }
  }
}

interface InitAction<S extends State> extends BaseAction {
  parentID?: string
  // @ts-expect-error doParent can be any type
  doParent?: DispatchFuncMap
  parentClass?: string

  state: S
}

const INIT = 'react-reducer-state/INIT'
const initCore = <S extends State>(
  myID: string,
  state: S,
  parentID?: string,
  // @ts-expect-error doParent can be any type
  doParent?: DispatchFuncMap,
  parentClass?: string,
): InitAction<S> => {
  return {
    myID,
    type: INIT,
    parentID,
    doParent,
    parentClass,

    state,
  }
}

const reduceInit = <S extends State>(state: ClassState<S>, action: InitAction<S>): ClassState<S> => {
  const { myID, parentID, doParent, parentClass, state: initState } = action

  const me: NodeState<S> = {
    id: myID,
    state: initState,
    [Relation.CHILDREN]: {},
    [Relation.LINKS]: {},
  }
  if (parentID && doParent) {
    me[PARENT] = { id: parentID, do: doParent, theClass: parentClass ?? '' }
  }

  const newNodes: NodeStateMap<S> = Object.assign({}, state.nodes, { [myID]: me })
  const newState: ClassState<S> = Object.assign({}, state, { nodes: newNodes })

  return newState
}

/***
 * setRoot
 */
const SET_ROOT = 'react-reducer-state/SET_ROOT'
const setRoot = (myID: string): BaseAction => ({
  myID,
  type: SET_ROOT,
})

const reduceSetRoot = <S extends State>(state: ClassState<S>, action: BaseAction): ClassState<S> => {
  const { myID } = action

  return Object.assign({}, state, { root: myID })
}

/***
 * addChild
 */

const ADD_CHILD = 'react-reducer-state/ADD_CHILD'
export const addChild = (myID: string, child: NodeMeta): AddRelativeAction => ({
  myID,
  type: ADD_CHILD,
  relative: child,
})

const reduceAddChild = <S extends State>(state: ClassState<S>, action: AddRelativeAction): ClassState<S> => {
  return reduceAddRelative(state, action, Relation.CHILDREN)
}

/***
 * addLink
 */
export const addLink = <S extends State>(myID: string, link: NodeMeta, isFromLink = false): Thunk<S> => {
  return (dispatch, getClassState) => {
    dispatch(addLinkCore(myID, link))

    if (!isFromLink) {
      // I connect to the other, would like the other to connect to me as well.
      // @ts-expect-error XXX doMe is a hidden variable for links.
      const { doMe, myClass } = getClassState()
      link.do.addLink(link.id, { id: myID, theClass: myClass, do: doMe }, true)
    }
  }
}

const ADD_LINK = 'react-reducer-state/ADD_LINK'
const addLinkCore = (myID: string, link: NodeMeta): AddRelativeAction => ({
  myID,
  type: ADD_LINK,
  relative: link,
})

const reduceAddLink = <S extends State>(state: ClassState<S>, action: AddRelativeAction): ClassState<S> => {
  return reduceAddRelative(state, action, Relation.LINKS)
}

const reduceAddRelative = <S extends State>(
  state: ClassState<S>,
  action: AddRelativeAction,
  relativeName: Relation,
): ClassState<S> => {
  const { myID, relative } = action
  const me = state.nodes[myID]
  if (!me) {
    return state
  }

  const { theClass, id: theID, do: theDo } = relative

  const relatives = me[relativeName] ?? {}
  const relativesByClass = relatives[theClass] ?? {}
  const relativeIDs = relativesByClass.list ?? []
  const newIDs = theID ? relativeIDs.concat([theID]) : relativeIDs

  const newRelatives = Object.assign({}, me[relativeName], { [theClass]: { list: newIDs, do: theDo } })
  const newMe = Object.assign({}, me, { [relativeName]: newRelatives })
  const newNodes = Object.assign({}, state.nodes, { [myID]: newMe })
  const newState = Object.assign({}, state, { nodes: newNodes })

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
export const remove = <S extends State>(myID: string, isFromParent = false): Thunk<S> => {
  return (dispatch, getClassState) => {
    const state = getClassState()
    const {
      myClass,
      nodes: { [myID]: me },
    } = state
    if (!me) {
      return
    }

    // parent removes me
    const parent = me[PARENT]
    if (!isFromParent && parent) {
      const { id: parentID, do: doParent } = parent
      if (parentID) {
        doParent.removeChild(parentID, myID, myClass, true)
      }
    }

    // remove children
    const children = me[Relation.CHILDREN]
    if (children) {
      const realChildren = children
      Object.keys(realChildren).map((eachClass) => {
        const child = realChildren[eachClass]
        child.list.map((eachID) => dispatch(removeChild(myID, eachID, eachClass, false)))
      })
    }

    // remove links
    const links = me[Relation.LINKS] ?? {}
    Object.keys(links).map((eachClass) => {
      const link = links[eachClass]
      link.list.map((eachID) => dispatch(removeLink(myID, eachID, eachClass, false)))
    })

    // remove me from myClass list
    dispatch(removeCore(myID))
  }
}

const REMOVE = 'react-reducer-state/REMOVE'
const removeCore = (myID: string): BaseAction => ({
  myID,
  type: REMOVE,
})

const reduceRemove = <S extends State>(state: ClassState<S>, action: BaseAction): ClassState<S> => {
  const { myID } = action

  const me = state.nodes[myID]
  if (!me) {
    return state
  }

  const newNodes = Object.keys(state.nodes)
    .filter((each) => each !== myID)
    .reduce((r: NodeStateMap<S>, x) => {
      r[x] = state.nodes[x]
      return r
    }, {})

  // root
  const newState = Object.assign({}, state, { nodes: newNodes })
  if (newState.root === myID) {
    newState.root = null
  }

  return newState
}

/***
 * remove-child
 */
export const removeChild = <S extends State>(
  myID: string,
  childID: string,
  childClass: string,
  isFromChild = false,
): Thunk<S> => {
  return (dispatch, getClassState) => {
    // @ts-expect-error theDo (from child) can by any type
    const relationRemove = (theDo: DispatchFuncMap) => theDo.remove(childID, true)
    removeRelation(
      dispatch,
      getClassState,
      myID,
      childID,
      childClass,
      isFromChild,
      relationRemove,
      removeChildCore,
      Relation.CHILDREN,
    )
  }
}

const REMOVE_CHILD = 'react-reducer-state/REMOVE_CHILD'
const removeChildCore = (myID: string, childID: string, childClass: string): RemoveRelativeAction => ({
  myID,
  type: REMOVE_CHILD,
  relationID: childID,
  relationClass: childClass,
})

const reduceRemoveChild = <S extends State>(state: ClassState<S>, action: RemoveRelativeAction): ClassState<S> => {
  const { myID, relationID, relationClass } = action

  return reduceRemoveRelation(state, myID, relationID, relationClass, Relation.CHILDREN)
}

/***
 * remove-link
 */
export const removeLink = <S extends State>(
  myID: string,
  linkID: string,
  linkClass: string,
  isFromLink = false,
): Thunk<S> => {
  return (dispatch, getClassState) => {
    const myClass = getClassState().myClass
    // @ts-expect-error theDo (from link) can be any type
    const relationRemove = (theDo: DispatchFuncMap) => theDo.removeLink(linkID, myID, myClass, true)
    removeRelation(
      dispatch,
      getClassState,
      myID,
      linkID,
      linkClass,
      isFromLink,
      relationRemove,
      removeLinkCore,
      Relation.LINKS,
    )
  }
}

const REMOVE_LINK = 'react-reducer-state/REMOVE_LINK'
const removeLinkCore = (myID: string, linkID: string, linkClass: string): RemoveRelativeAction => ({
  myID,
  type: REMOVE_LINK,
  relationID: linkID,
  relationClass: linkClass,
})

const reduceRemoveLink = <S extends State>(state: ClassState<S>, action: RemoveRelativeAction): ClassState<S> => {
  const { myID, relationID, relationClass } = action

  return reduceRemoveRelation(state, myID, relationID, relationClass, Relation.LINKS)
}

/***
 * remove-relation
 */
// @ts-expect-error toDo (from relation) can be any type
type RelationRemove = (theDo: DispatchFuncMap) => void
type RemoveRelationCore = (myID: string, relationID: string, relationClass: string) => BaseAction

const removeRelation = <S extends State>(
  dispatch: Dispatch<S>,
  getClassState: GetClassState<S>,
  myID: string,
  relationID: string,
  relationClass: string,
  isFromRelation: boolean,
  relationRemove: RelationRemove,
  removeRelationCore: RemoveRelationCore,
  relationName: Relation,
) => {
  const state = getClassState()

  const me = state.nodes[myID]
  if (!me) {
    return
  }

  const relation = me[relationName]
  if (!relation) {
    return
  }
  const relationByClass = relation[relationClass]
  if (!relationByClass) {
    return
  }

  const newIDs = relationByClass.list.filter((eachID: string) => eachID !== relationID)
  if (relationByClass.list.length === newIDs.length) return

  if (!isFromRelation) {
    relationRemove(relationByClass.do)
  }

  dispatch(removeRelationCore(myID, relationID, relationClass))
}

const reduceRemoveRelation = <S extends State>(
  state: ClassState<S>,
  myID: string,
  relationID: string,
  relationClass: string,
  relationName: Relation.LINKS | Relation.CHILDREN,
): ClassState<S> => {
  const me = state.nodes[myID]
  if (!me) return state

  const relation = me[relationName]
  if (!relation) return state

  const relationByClass = relation[relationClass]
  if (!relationByClass) return state

  const relationIDs = relationByClass.list || []
  const newIDs = relationIDs.filter((eachID: string) => eachID !== relationID)
  if (relationIDs.length === newIDs.length) return state

  const newRelation = Object.assign({}, relation)
  if (newIDs.length === 0) {
    delete newRelation[relationClass]
  } else {
    const newRelationByClass = Object.assign({}, relationByClass, { list: newIDs })
    newRelation[relationClass] = newRelationByClass
  }

  const newMe = Object.assign({}, me, { [relationName]: newRelation })
  const newNodes = Object.assign({}, state.nodes, { [myID]: newMe })
  const newState = Object.assign({}, state, { nodes: newNodes })

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
export const setData = <S extends State>(myID: string, data: S): BaseAction => ({
  myID,
  type: SET_DATA,
  data,
})

const reduceSetData = <S extends State>(state: ClassState<S>, action: BaseAction): ClassState<S> => {
  const { myID, data } = action

  const me = state.nodes[myID]
  if (!me) return state

  const newMyState = Object.assign({}, me.state, data)
  const newMe = Object.assign({}, me, { state: newMyState })
  const newNodes = Object.assign({}, state.nodes, { [myID]: newMe })
  const newState = Object.assign({}, state, { nodes: newNodes })

  return newState
}

/*****
 * createReducer
 *****/

export interface ReduceMap<S extends State> {
  [type: string]: ReduceFunc<S>
}

// default reduceMap
const DEFAULT_REDUCE_MAP: <S extends State>() => ReduceMap<S> = () => ({
  // @ts-expect-error reduceInit is a ReduceFunc<S>
  [INIT]: reduceInit,
  [SET_DATA]: reduceSetData,
  [REMOVE]: reduceRemove,

  // @ts-expect-error reduceAddChild is a ReduceFunc<S>
  [ADD_CHILD]: reduceAddChild,
  // @ts-expect-error reduceRemoveChild is a ReduceFunc<S>
  [REMOVE_CHILD]: reduceRemoveChild,

  // @ts-expect-error reduceAddLink is a ReduceFunc<S>
  [ADD_LINK]: reduceAddLink,
  // @ts-expect-error reduceRemoveLink is a ReduceFunc<S>
  [REMOVE_LINK]: reduceRemoveLink,

  // setRoot.
  // Typically we don't need this in programming.
  // The root is automatically determined if root is not set.
  [SET_ROOT]: reduceSetRoot,
})

/***
 * createReducer
 * params: reduceMap
 */
export const createReducer = <S extends State>(reduceMap?: ReduceMap<S>): Reducer<S> => {
  return (state: ClassState<S>, action: BaseAction): ClassState<S> => {
    if (!action) {
      return state
    }

    if (reduceMap?.[action.type]) {
      return reduceMap[action.type](state, action)
    }

    const defaultReduceMap = DEFAULT_REDUCE_MAP<S>()
    if (defaultReduceMap?.[action.type]) {
      return defaultReduceMap[action.type](state, action)
    }

    return state
  }
}

/***
 * Retrieving state
 ***/

export const getRootNode = <S extends State>(state: ClassState<S>): NodeState<S> | null => {
  const root = state.root
  if (!root) {
    return null
  }
  return state.nodes[root] || null
}

export const getRootID = <S extends State>(state: ClassState<S>): string => {
  return state.root ?? ''
}

export const getRoot = <S extends State>(state: ClassState<S>): S | null => {
  const root = state.root
  if (!root) {
    return null
  }
  const me = state.nodes[root]
  if (!me) {
    return null
  }
  return me.state
}

export const getNode = <S extends State>(state: ClassState<S>, myID?: string): NodeState<S> | null => {
  if (!myID) {
    return getRootNode(state)
  }

  return state.nodes[myID] || null
}

export const getState = <S extends State>(state: ClassState<S>, myID?: string): S | null => {
  if (!myID) {
    return getRoot(state)
  }

  const me = state.nodes[myID]
  if (!me) {
    return null
  }
  return me.state
}

export const getChildIDs = <S extends State>(me: NodeState<S>, childClass: string): string[] => {
  return getRelativeIDs(me, childClass, Relation.CHILDREN)
}

const getRelativeIDs = <S extends State>(me: NodeState<S>, relativeClass: string, relativeName: Relation): string[] => {
  const relatives = me[relativeName]
  if (!relatives) {
    return []
  }
  const relativesByClass = relatives[relativeClass]
  if (!relativesByClass) {
    return []
  }

  return relativesByClass.list
}

export const getChildID = <S extends State>(me: NodeState<S>, childClass: string): string => {
  return getRelativeID(me, childClass, Relation.CHILDREN)
}

const getRelativeID = <S extends State>(me: NodeState<S>, relativeClass: string, relativeName: Relation): string => {
  const ids = getRelativeIDs(me, relativeClass, relativeName)
  return ids.length ? ids[0] : ''
}

export const getLinkIDs = <S extends State>(me: NodeState<S>, linkClass: string): string[] => {
  return getRelativeIDs(me, linkClass, Relation.LINKS)
}

export const getLinkID = <S extends State>(me: NodeState<S>, linkClass: string): string => {
  return getRelativeID(me, linkClass, Relation.LINKS)
}

/***
 * Utils
 ***/
const _GLOBAL_IDS = new Set()

const _GEN_UUID_COUNT = 3

const _GEN_UUID_STATE = {
  iterate: 1,
}

export const genUUID = (myuuidv4?: () => string): string => {
  let theID = ''
  let isAdd = false
  for (let i = 0; i < _GEN_UUID_COUNT; i++) {
    theID = genUUIDCore(myuuidv4)
    if (_GLOBAL_IDS.has(theID)) {
      continue
    }
    _GLOBAL_IDS.add(theID)
    isAdd = true
    break
  }
  if (isAdd) {
    return theID
  }
  _GEN_UUID_STATE.iterate += 1
  theID = genUUIDCore()
  return theID
}

const genUUIDCore = (myuuid: () => string = uuidv4): string => {
  let theID = ''
  for (let j = 0; j < _GEN_UUID_STATE.iterate; j++) {
    theID += myuuid()
  }
  return theID
}

const DEFAULT_REDUCER_MODULE_FUNCS = {
  init,
  setData,
  remove,

  // XXX addChild shouldn't be used outside of init.
  addChild,

  removeChild,

  addLink,
  removeLink,
}

export type DefaultReducerModuleFunc = typeof DEFAULT_REDUCER_MODULE_FUNCS

/**********
 * useReducer
 **********/
export const useReducer = <S extends State, R extends ReducerModuleFunc<S>>(
  theDo: ReducerModule<S, R>,
): [ClassState<S>, DispatchFuncMap<S, R>] => {
  const refDispatchMapByClass: RefDispatchFuncMapByClassMap<S, R> = useRef({})
  const dispatchMapByClass = refDispatchMapByClass.current
  const { myClass } = theDo

  const [theReducer, _] = useState(() => theDo.default ?? createReducer<S>())

  // It requires shared nodes for the same class to have the same dispatchMap.
  // We don't optimize the dispatchMap in this PR.
  const isFirstTime = !dispatchMapByClass[myClass]
  if (isFirstTime) {
    // @ts-expect-error {} is a kind of DispatchFuncMap<S, R>
    dispatchMapByClass[myClass] = {}
  }
  const dispatchMap = dispatchMapByClass[myClass]
  const nodes: NodeStateMap<S> = {}

  const [state, dispatch] = useThunkReducer(theReducer, {
    myClass,
    // @ts-expect-error doMe is a hidden variable for ClassState
    doMe: dispatchMap,
    nodes,
  })

  // the dispatchMap is always the same.
  // we can do early return if not first time.
  if (!isFirstTime) {
    return [state, dispatchMap]
  }

  Object.keys(theDo)
    // default and myClass are reserved words.
    // functions starting reduce are included in default and not exported.
    .filter((each) => typeof theDo[each] === 'function')
    .reduce((val, eachAction) => {
      const action: ActionFunc<S> = theDo[eachAction]
      // @ts-expect-error eachAction is in DispatchFuncMap<S, R>
      // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
      val[eachAction] = (...params: any[]) => dispatch(action(...params))
      return val
    }, dispatchMap)

  // default functions
  Object.keys(DEFAULT_REDUCER_MODULE_FUNCS).reduce((val, eachAction) => {
    if (val[eachAction]) {
      return val
    }
    // @ts-expect-error DEFAULT_REDUCER_MODULE_FUNCS are all ActionFunc<S>
    const action: ActionFunc<S> = DEFAULT_REDUCER_MODULE_FUNCS[eachAction]
    // @ts-expect-error eachAction is in DispatchFuncMap<S, R>
    // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
    val[eachAction] = (...params: any[]) => dispatch(action(...params))
    return val
  }, dispatchMap)

  return [state, dispatchMap]
}
