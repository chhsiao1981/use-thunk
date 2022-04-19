import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import useThunkReducer from 'react-hook-thunk-reducer'

/**********
 * useActionDispatcherReducer
 **********/
export const useActionDispatchReducer = (action) => {
  const [state, dispatch] = useThunkReducer(action.default, {})

  let boundDispatchAction = Object.keys(action).filter((each) => each !== 'default').reduce((val, each) => {
    val[each] = (...params) => dispatch(action[each](...params))
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
export const init = ({ myID, myClass, doMe, parentID, doParent, links, ...params }) => {
  if (!myID) myID = genUUID()

  return (dispatch, _) => {
    dispatch(initCore({ myID, myClass, doMe, parentID, doParent, ...params }))
    if (links) {
      links.map((each) => dispatch(addLink(myID, each)))
    }
    if (parentID) {
      doParent.addChild(parentID, myID, myClass, doMe)
    } else {
      dispatch(setRoot(myID))
    }
  }
}

const INIT = 'react-reducer-state/INIT'
const initCore = ({ myID, myClass, doMe, parentID, doParent, ...params }) => ({
  myID,
  type: INIT,
  myClass,
  doMe,
  parentID,
  doParent,
  ...params,
})

const reduceInit = (state, action) => {
  const { myID, type: _, myClass, doMe, parentID, doParent, ...params } = action
  let newList = (state.ids || []).concat([myID])
  return Object.assign({}, state, { myClass, doMe, ids: newList, [myID]: { _children: {}, _parent: { parentID, doParent }, _links: {}, id: myID, ...params } })
}

/***
 * setRoot
 */
const SET_ROOT = 'react-reducer-state/SET_ROOT'
const setRoot = (myID) => ({
  myID,
  type: SET_ROOT,
})

const reduceSetRoot = (state, action) => {
  const { myID } = action

  return Object.assign({}, state, { root: myID })
}

/***
 * addChild
 */
const ADD_CHILD = 'react-reducer-state/ADD_CHILD'
export const addChild = (myID, childID, childClass, doChild) => ({
  myID,
  type: ADD_CHILD,
  childID,
  childClass,
  doChild,
})

const reduceAddChild = (state, action) => {
  const { myID, childID, childClass, doChild } = action

  if (!state[myID]) {
    return state
  }

  let newIDs = ((state[myID]._children[childClass] || {}).list || []).concat([childID])

  state[myID]._children = Object.assign({}, state[myID]._children, { [childClass]: { list: newIDs, do: doChild } })

  state = Object.assign({}, state)

  return state
}

/***
 * addLink
 */
export const addLink = (myID, link, isFromLink = false) => {
  return (dispatch, getState) => {
    dispatch(addLinkCore(myID, link))
    if (!isFromLink) {
      const { myClass, doMe } = getState()

      link.do.addLink(link.id, { id: myID, myClass, do: doMe }, true)
    }
  }
}

const ADD_LINK = 'react-reducer-state/ADD_LINK'
const addLinkCore = (myID, link) => ({
  myID,
  type: ADD_LINK,
  link,
})

const reduceAddLink = (state, action) => {
  const { myID, link } = action
  let me = state[myID]
  if (!me) return

  const { myClass: linkClass, id: linkID, do: doLink } = link

  let newIDs = ((state[myID]._links[linkClass] || {}).list || []).concat([linkID])

  // no need to update _links[linkClass]
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
export const remove = (myID, isFromParent = false) => {
  return (dispatch, getState) => {
    let state = getState()
    const { myClass, [myID]: me } = state

    let parentID = me._parent.parentID || null

    if (!isFromParent && parentID) {
      let { _parent: { doParent } } = me
      doParent.removeChild(parentID, myID, myClass, true)
    }

    Object.keys(me._children).map((eachClass) => {
      let child = me._children[eachClass]
      child.list.map((eachID) => dispatch(removeChild(myID, eachID, eachClass, false)))
    })

    Object.keys(me._links).map((eachClass) => {
      let link = me._links[eachClass]
      link.list.map((eachID) => dispatch(removeLink(myID, eachID, eachClass, false)))
    })

    dispatch(removeCore(myID))
  }
}

const REMOVE = 'react-reducer-state/REMOVE'
const removeCore = (myID) => ({
  myID,
  type: REMOVE,
})

const reduceRemove = (state, action) => {
  const { myID } = action
  let me = state[myID]
  if (!me) {
    return state
  }

  let newIDs = (state['ids'] || []).filter((eachID) => eachID != myID)
  delete state[myID]

  return Object.assign({}, state, { 'ids': newIDs })
}

/***
 * remove-child
 */
export const removeChild = (myID, childID, childClass, isFromChild = false) => {
  return (dispatch, getState) => {
    let relationRemove = (theDo, relationID) => theDo.remove(relationID, true)

    removeRelation(dispatch, getState, myID, childID, childClass, isFromChild, relationRemove, removeChildCore, '_children')
  }
}

const REMOVE_CHILD = 'react-reducer-state/REMOVE_CHILD'
const removeChildCore = (myID, childID, childClass) => ({
  myID,
  type: REMOVE_CHILD,
  childID,
  childClass,
})

const reduceRemoveChild = (state, action) => {

  const { myID, childID, childClass } = action

  return reduceRemoveRelation(state, myID, childID, childClass, '_children')
}

/***
 * remove-link
 */
export const removeLink = (myID, linkID, linkClass, isFromLink = false) => {
  return (dispatch, getState) => {
    let myClass = getState().myClass
    let relationRemove = (theDo, relationID) => theDo.removeLink(relationID, myID, myClass, true)
    removeRelation(dispatch, getState, myID, linkID, linkClass, isFromLink, relationRemove, removeLinkCore, '_links')
  }
}

const REMOVE_LINK = 'react-reducer-state/REMOVE_LINK'
const removeLinkCore = (myID, linkID, linkClass) => ({
  myID,
  type: REMOVE_LINK,
  linkID,
  linkClass,
})

const reduceRemoveLink = (state, action) => {
  const { myID, linkID, linkClass } = action

  return reduceRemoveRelation(state, myID, linkID, linkClass, '_links')
}

/***
 * remove-relation
 */
const removeRelation = (dispatch, getState, myID, relationID, relationClass, isFromRelation, relationRemove, relationRemoveCore, relationName) => {
  let me = getState()[myID]
  if (!me) return

  let relation = me[relationName][relationClass] || null
  if (!relation) return

  let newIDs = relation.list.filter((eachID) => eachID != relationID)
  if (relation.list.length === newIDs.length) return

  if (!isFromRelation) relationRemove(relation.do, relationID)

  dispatch(relationRemoveCore(myID, relationID, relationClass))
}

const reduceRemoveRelation = (state, myID, relationID, relationClass, relationName) => {
  let me = state[myID]
  if (!me) return state

  let relation = me[relationName][relationClass] || null
  if (!relation) return state

  let relationIDs = relation.list
  let newIDs = relationIDs.filter((eachID) => eachID !== relationID)
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
export const setData = (myID, data) => ({
  myID,
  type: SET_DATA,
  data,
})

const reduceSetData = (state, action) => {
  const { myID, data } = action

  let me = state[myID]
  if (!me) return state

  state = Object.assign({}, state, { [myID]: Object.assign({}, me, data) })

  return state
}

// theReduceMap
const theReduceMap = {
  [INIT]: reduceInit,
  [ADD_CHILD]: reduceAddChild,
  [ADD_LINK]: reduceAddLink,
  [REMOVE]: reduceRemove,
  [REMOVE_CHILD]: reduceRemoveChild,
  [REMOVE_LINK]: reduceRemoveLink,
  [SET_DATA]: reduceSetData,
  [SET_ROOT]: reduceSetRoot,
}

/*****
 * createReducer
 *****/
/***
 * createReducer
 * params: reduceMap
 */
export const createReducer = (reduceMap) => {
  return (state, action) => {
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

export const getRoot = (state) => state[state.root]
export const getMe = (state, myID) => state[myID]
export const getChildIDs = (me, childClass) => (me._children[childClass] || {}).list || []
export const getChildID = (me, childClass) => {
  let ids = getChildIDs(me, childClass)
  return ids.length ? ids[0] : null
}
export const getLinkIDs = (me, linkClass) => (me._links[linkClass] || {}).list || []
export const getLinkID = (me, linkClass) => {
  let ids = getLinkIDs(me, childClass)
  return ids.length ? ids[0] : null
}

/***
 * Utils
 ***/
const _GLOBAL_IDS = new Set()

export const genUUID = () => {
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

export const Empty = () => (<div style={{ display: 'none' }}></div>)
