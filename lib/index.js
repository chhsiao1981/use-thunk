"use strict";

exports.__esModule = true;
exports.useReducer = exports.setData = exports.removeLink = exports.removeChild = exports.remove = exports.init = exports.getState = exports.getRootNode = exports.getRootID = exports.getRoot = exports.getNode = exports.getLinkIDs = exports.getLinkID = exports.getChildIDs = exports.getChildID = exports.genUUID = exports.createReducer = exports.addLink = exports.addChild = void 0;
var _react = require("react");
var _thunkReducer = _interopRequireDefault(require("./thunk-reducer"));
var _uuid = require("uuid");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**********
 * useReducer
 **********/
const useReducer = theDo => {
  const dispatchedReducer = (0, _react.useRef)({});
  let currentDispatchedReducer = dispatchedReducer.current;
  const {
    myClass
  } = theDo;
  if (!currentDispatchedReducer[myClass]) {
    currentDispatchedReducer[myClass] = {};
  }
  let currentDispatched = currentDispatchedReducer[myClass];
  let nodes = {};
  const [state, dispatch] = (0, _thunkReducer.default)(theDo.default, {
    myClass,
    doMe: currentDispatched,
    nodes
  });
  Object.keys(theDo).filter(each => each !== 'default' && each !== 'myClass').reduce((val, each) => {
    // @ts-ignore because default and myClass are already filtered, the rest are ActionFunc<S>
    let action = theDo[each];
    val[each] = (...params) => dispatch(action(...params));
    return val;
  }, currentDispatched);
  return [state, currentDispatched];
};

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
exports.useReducer = useReducer;
const init = (params, myuuidv4) => {
  return async (dispatch, getClassState) => {
    let myID = params.myID || genUUID(myuuidv4);
    const {
      parentID,
      doParent,
      state
    } = params;
    dispatch(initCore(myID, parentID, doParent, state));
    const {
      myClass,
      doMe
    } = getClassState();

    // parent or root
    if (parentID && doParent) {
      doParent.addChild(parentID, {
        id: myID,
        theClass: myClass,
        do: doMe
      });
    } else {
      dispatch(setRoot(myID));
    }
  };
};
exports.init = init;
const INIT = 'react-reducer-state/INIT';
const initCore = (myID, parentID, doParent, state) => {
  return {
    myID,
    type: INIT,
    parentID,
    doParent,
    state
  };
};
const reduceInit = (state, action) => {
  let {
    myID,
    parentID,
    doParent,
    state: theState
  } = action;
  theState = theState || {};
  let me = {
    id: myID,
    state: theState,
    _children: {},
    _links: {}
  };
  if (parentID) {
    me._parent = {
      id: parentID,
      do: doParent,
      theClass: ''
    };
  }
  let newNodes = Object.assign({}, state.nodes, {
    [myID]: me
  });
  let newState = Object.assign({}, state, {
    nodes: newNodes
  });
  return newState;
};

/***
 * setRoot
 */
const SET_ROOT = 'react-reducer-state/SET_ROOT';
const setRoot = myID => ({
  myID,
  type: SET_ROOT
});
const reduceSetRoot = (state, action) => {
  const {
    myID
  } = action;
  return Object.assign({}, state, {
    root: myID
  });
};

/***
 * addChild
 */
const ADD_CHILD = 'react-reducer-state/ADD_CHILD';
const addChild = (myID, child) => ({
  myID,
  type: ADD_CHILD,
  relative: child
});
exports.addChild = addChild;
const reduceAddChild = (state, action) => {
  return reduceAddRelative(state, action, '_children');
};

/***
 * addLink
 */
const addLink = (myID, link, isFromLink = false) => {
  return async (dispatch, getClassState) => {
    dispatch(addLinkCore(myID, link));
    if (!isFromLink) {
      // I connect to the other, would like the other to connect to me as well.
      const {
        doMe,
        myClass
      } = getClassState();
      link.do.addLink(link.id, {
        id: myID,
        theClass: myClass,
        do: doMe
      }, true);
    }
  };
};
exports.addLink = addLink;
const ADD_LINK = 'react-reducer-state/ADD_LINK';
const addLinkCore = (myID, link) => ({
  myID,
  type: ADD_LINK,
  relative: link
});
const reduceAddLink = (state, action) => {
  return reduceAddRelative(state, action, '_links');
};
const reduceAddRelative = (state, action, relativeName) => {
  const {
    myID,
    relative
  } = action;
  let me = state.nodes[myID];
  if (!me) {
    return state;
  }
  const {
    theClass,
    id: theID,
    do: theDo
  } = relative;
  let relatives = me[relativeName] || {};
  let relativesByClass = relatives[theClass] || {};
  let relativeIDs = relativesByClass.list || [];
  let newIDs = theID ? relativeIDs.concat([theID]) : relativeIDs;
  let newRelatives = Object.assign({}, me[relativeName], {
    [theClass]: {
      list: newIDs,
      do: theDo
    }
  });
  let newMe = Object.assign({}, me, {
    [relativeName]: newRelatives
  });
  let newNodes = Object.assign({}, state.nodes, {
    [myID]: newMe
  });
  let newState = Object.assign({}, state, {
    nodes: newNodes
  });
  return newState;
};

/*****
 * remove
 *****/
/***
 * remove
 * params: myID
 *         isFromParent
 */
const remove = (myID, isFromParent = false) => {
  return async (dispatch, getClassState) => {
    let state = getClassState();
    const {
      myClass,
      nodes: {
        [myID]: me
      }
    } = state;
    if (!me) {
      return;
    }

    // parent removes me
    let parent = me._parent;
    if (!isFromParent && parent) {
      const {
        id: parentID,
        do: doParent
      } = parent;
      if (parentID) {
        doParent.removeChild(parentID, myID, myClass, true);
      }
    }

    // remove children
    let children = me._children;
    if (children) {
      let realChildren = children;
      Object.keys(realChildren).map(eachClass => {
        let child = realChildren[eachClass];
        child.list.map(eachID => dispatch(removeChild(myID, eachID, eachClass, false)));
      });
    }

    // remove links
    let links = me._links || {};
    Object.keys(links).map(eachClass => {
      let link = links[eachClass];
      link.list.map(eachID => dispatch(removeLink(myID, eachID, eachClass, false)));
    });

    // remove me from myClass list
    dispatch(removeCore(myID));
  };
};
exports.remove = remove;
const REMOVE = 'react-reducer-state/REMOVE';
const removeCore = myID => ({
  myID,
  type: REMOVE
});
const reduceRemove = (state, action) => {
  const {
    myID
  } = action;
  let me = state.nodes[myID];
  if (!me) {
    return state;
  }
  let newNodes = Object.keys(state.nodes).filter(each => each !== myID).reduce((r, x) => {
    r[x] = state.nodes[x];
    return r;
  }, {});

  // root
  let newState = Object.assign({}, state, {
    nodes: newNodes
  });
  if (newState.root === myID) {
    delete newState.root;
  }
  return newState;
};

/***
 * remove-child
 */
const removeChild = (myID, childID, childClass, isFromChild = false) => {
  return async (dispatch, getClassState) => {
    let relationRemove = theDo => theDo.remove(childID, true);
    removeRelation(dispatch, getClassState, myID, childID, childClass, isFromChild, relationRemove, removeChildCore, '_children');
  };
};
exports.removeChild = removeChild;
const REMOVE_CHILD = 'react-reducer-state/REMOVE_CHILD';
const removeChildCore = (myID, childID, childClass) => ({
  myID,
  type: REMOVE_CHILD,
  childID,
  childClass
});
const reduceRemoveChild = (state, action) => {
  const {
    myID,
    childID,
    childClass
  } = action;
  return reduceRemoveRelation(state, myID, childID, childClass, '_children');
};

/***
 * remove-link
 */
const removeLink = (myID, linkID, linkClass, isFromLink = false) => {
  return async (dispatch, getClassState) => {
    let myClass = getClassState().myClass;
    let relationRemove = theDo => theDo.removeLink(linkID, myID, myClass, true);
    removeRelation(dispatch, getClassState, myID, linkID, linkClass, isFromLink, relationRemove, removeLinkCore, '_links');
  };
};
exports.removeLink = removeLink;
const REMOVE_LINK = 'react-reducer-state/REMOVE_LINK';
const removeLinkCore = (myID, linkID, linkClass) => ({
  myID,
  type: REMOVE_LINK,
  linkID,
  linkClass
});
const reduceRemoveLink = (state, action) => {
  const {
    myID,
    linkID,
    linkClass
  } = action;
  return reduceRemoveRelation(state, myID, linkID, linkClass, '_links');
};

/***
 * remove-relation
 */

const removeRelation = (dispatch, getClassState, myID, relationID, relationClass, isFromRelation, relationRemove, removeRelationCore, relationName) => {
  let state = getClassState();
  let me = state.nodes[myID];
  if (!me) {
    return;
  }
  let relation = me[relationName];
  if (!relation) {
    return;
  }
  let relationByClass = relation[relationClass];
  if (!relationByClass) {
    return;
  }
  let newIDs = relationByClass.list.filter(eachID => eachID !== relationID);
  if (relationByClass.list.length === newIDs.length) return;
  if (!isFromRelation) {
    relationRemove(relationByClass.do);
  }
  dispatch(removeRelationCore(myID, relationID, relationClass));
};
const reduceRemoveRelation = (state, myID, relationID, relationClass, relationName) => {
  let me = state.nodes[myID];
  if (!me) return state;
  let relation = me[relationName];
  if (!relation) return state;
  let relationByClass = relation[relationClass];
  if (!relationByClass) return state;
  let relationIDs = relationByClass.list || [];
  let newIDs = relationIDs.filter(eachID => eachID !== relationID);
  if (relationIDs.length === newIDs.length) return state;
  let newRelation = Object.assign({}, relation);
  if (newIDs.length == 0) {
    delete newRelation[relationClass];
  } else {
    let newRelationByClass = Object.assign({}, relationByClass, {
      list: newIDs
    });
    newRelation[relationClass] = newRelationByClass;
  }
  let newMe = Object.assign({}, me, {
    [relationName]: newRelation
  });
  let newNodes = Object.assign({}, state.nodes, {
    [myID]: newMe
  });
  let newState = Object.assign({}, state, {
    nodes: newNodes
  });
  return newState;
};

/*****
 * set data
 *****/
/***
 * setData
 * params: myID
 *         data
 */
const SET_DATA = 'react-reducer-state/SET_DATA';
const setData = (myID, data) => ({
  myID,
  type: SET_DATA,
  data
});
exports.setData = setData;
const reduceSetData = (state, action) => {
  const {
    myID,
    data
  } = action;
  let me = state.nodes[myID];
  if (!me) return state;
  let newMyState = Object.assign({}, me.state, data);
  let newMe = Object.assign({}, me, {
    state: newMyState
  });
  let newNodes = Object.assign({}, state.nodes, {
    [myID]: newMe
  });
  let newState = Object.assign({}, state, {
    nodes: newNodes
  });
  return newState;
};

/*****
 * createReducer
 *****/

// theReduceMap
const defaultReduceMap_f = () => ({
  [INIT]: reduceInit,
  [ADD_CHILD]: reduceAddChild,
  [ADD_LINK]: reduceAddLink,
  [REMOVE]: reduceRemove,
  [REMOVE_CHILD]: reduceRemoveChild,
  [REMOVE_LINK]: reduceRemoveLink,
  [SET_DATA]: reduceSetData,
  [SET_ROOT]: reduceSetRoot
});

/***
 * createReducer
 * params: reduceMap
 */
const createReducer = reduceMap => {
  return (state, action) => {
    if (!action) {
      return state;
    }

    // @ts-ignore because all the action in reduceMap are BaseAction
    let baseAction = action;
    if (reduceMap && reduceMap[baseAction.type]) {
      return reduceMap[baseAction.type](state, baseAction);
    }
    let defaultReduceMap = defaultReduceMap_f();
    if (defaultReduceMap[baseAction.type]) {
      return defaultReduceMap[baseAction.type](state, baseAction);
    }
    return state;
  };
};

/***
 * Retrieving state
 ***/
exports.createReducer = createReducer;
const getRootNode = state => {
  let root = state.root;
  if (!root) {
    return null;
  }
  return state.nodes[root] || null;
};
exports.getRootNode = getRootNode;
const getRootID = state => {
  return state.root || '';
};
exports.getRootID = getRootID;
const getRoot = state => {
  let root = state.root;
  if (!root) {
    return null;
  }
  let me = state.nodes[root];
  if (!me) {
    return null;
  }
  return me.state;
};
exports.getRoot = getRoot;
const getNode = (state, myID) => {
  return state.nodes[myID] || null;
};
exports.getNode = getNode;
const getState = (state, myID) => {
  let me = state.nodes[myID];
  if (!me) {
    return null;
  }
  return me.state;
};
exports.getState = getState;
const getChildIDs = (me, childClass) => {
  return getRelativeIDs(me, childClass, '_children');
};
exports.getChildIDs = getChildIDs;
const getRelativeIDs = (me, relativeClass, relativeName) => {
  let relatives = me[relativeName];
  if (!relatives) {
    return [];
  }
  let relativesByClass = relatives[relativeClass];
  if (!relativesByClass) {
    return [];
  }
  return relativesByClass.list;
};
const getChildID = (me, childClass) => {
  return getRelativeID(me, childClass, '_children');
};
exports.getChildID = getChildID;
const getRelativeID = (me, relativeClass, relativeName) => {
  let ids = getRelativeIDs(me, relativeClass, relativeName);
  return ids.length ? ids[0] : '';
};
const getLinkIDs = (me, linkClass) => {
  return getRelativeIDs(me, linkClass, '_links');
};
exports.getLinkIDs = getLinkIDs;
const getLinkID = (me, linkClass) => {
  return getRelativeID(me, linkClass, '_links');
};

/***
 * Utils
 ***/
exports.getLinkID = getLinkID;
const _GLOBAL_IDS = new Set();
const _GEN_UUID_COUNT = 3;
const _GEN_UUID_STATE = {
  iterate: 1
};
const genUUID = myuuidv4 => {
  let theID = '';
  let isAdd = false;
  for (let i = 0; i < _GEN_UUID_COUNT; i++) {
    theID = genUUIDCore(myuuidv4);
    if (_GLOBAL_IDS.has(theID)) {
      continue;
    }
    _GLOBAL_IDS.add(theID);
    isAdd = true;
    break;
  }
  if (isAdd) {
    return theID;
  }
  _GEN_UUID_STATE.iterate += 1;
  theID = genUUIDCore();
  return theID;
};
exports.genUUID = genUUID;
const genUUIDCore = myuuidv4 => {
  let theID = '';
  let myuuid = myuuidv4 ? myuuidv4 : _uuid.v4;
  for (let j = 0; j < _GEN_UUID_STATE.iterate; j++) {
    theID += myuuid();
  }
  return theID;
};