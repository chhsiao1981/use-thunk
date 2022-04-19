"use strict";

exports.__esModule = true;
exports.useActionDispatchReducer = exports.setData = exports.removeLink = exports.removeChild = exports.remove = exports.init = exports.getRoot = exports.getMe = exports.getLinkIDs = exports.getLinkID = exports.getChildIDs = exports.getChildID = exports.genUUID = exports.createReducer = exports.addLink = exports.addChild = exports.Empty = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactHookThunkReducer = _interopRequireDefault(require("react-hook-thunk-reducer"));

var _uuid = require("uuid");

const _excluded = ["myID", "myClass", "doMe", "parentID", "doParent", "links"],
      _excluded2 = ["myID", "myClass", "doMe", "parentID", "doParent"],
      _excluded3 = ["myID", "myClass", "doMe", "parentID", "doParent"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const useActionDispatchReducer = action => {
  const [state, dispatch] = (0, _reactHookThunkReducer.default)(action.default, {});
  let boundDispatchAction = Object.keys(action).filter(each => each !== 'default').reduce((val, each) => {
    val[each] = (...params) => dispatch(action[each](...params));

    return val;
  }, {});
  return [state, boundDispatchAction];
};
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


exports.useActionDispatchReducer = useActionDispatchReducer;

const init = params => {
  let {
    myID,
    myClass,
    doMe,
    parentID,
    doParent,
    links
  } = params,
      theRest = _objectWithoutPropertiesLoose(params, _excluded);

  if (!myID) myID = genUUID();
  return (dispatch, _) => {
    dispatch(initCore(Object.assign({
      myID,
      myClass,
      doMe,
      parentID,
      doParent
    }, theRest))); // links

    if (links) {
      links.map(each => dispatch(addLink(myID, each)));
    } // parent or root


    if (parentID) {
      doParent == null ? void 0 : doParent.addChild(parentID, myID, myClass, doMe);
    } else {
      dispatch(setRoot(myID));
    }
  };
};

exports.init = init;
const INIT = 'react-reducer-state/INIT';

const initCore = params => {
  const {
    myID,
    myClass,
    doMe,
    parentID,
    doParent
  } = params,
        theRest = _objectWithoutPropertiesLoose(params, _excluded2);

  return Object.assign({
    myID,
    type: INIT,
    myClass,
    doMe,
    parentID,
    doParent
  }, theRest);
};

const reduceInit = (state, action) => {
  const {
    myID,
    myClass,
    doMe,
    parentID,
    doParent
  } = action,
        params = _objectWithoutPropertiesLoose(action, _excluded3);

  let newList = (state.ids || []).concat([myID]);
  return Object.assign({}, state, {
    myClass,
    doMe,
    ids: newList,
    [myID]: Object.assign({
      _children: {},
      _parent: {
        id: parentID,
        theClass: '',
        do: doParent
      },
      _links: {},
      id: myID
    }, params)
  });
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

const addChild = (myID, childID, childClass, doChild) => ({
  myID,
  type: ADD_CHILD,
  childID,
  childClass,
  doChild
});

exports.addChild = addChild;

const reduceAddChild = (state, action) => {
  const {
    myID,
    childID,
    childClass,
    doChild
  } = action;

  if (!state[myID]) {
    return state;
  }

  let children = (state[myID] || {})._children || {};
  let childrenByClass = children[childClass] || {};
  let childList = childrenByClass.list || [];
  let newIDs = childList.concat([childID]);
  state[myID]._children = Object.assign({}, state[myID]._children, {
    [childClass]: {
      list: newIDs,
      do: doChild
    }
  });
  state = Object.assign({}, state);
  return state;
};
/***
 * addLink
 */


const addLink = (myID, link, isFromLink = false) => {
  return (dispatch, getState) => {
    dispatch(addLinkCore(myID, link));

    if (!isFromLink) {
      // I connect to the other, would like the other to connect to me as well.
      const {
        doMe,
        myClass
      } = getState();
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
  link
});

const reduceAddLink = (state, action) => {
  const {
    myID,
    link
  } = action;

  if (!state[myID]) {
    return state;
  }

  const {
    theClass: linkClass,
    id: linkID,
    do: doLink
  } = link;
  let links = (state[myID] || {})._links || {};
  let linksByClass = links[linkClass] || {};
  let linkList = linksByClass.list || [];
  let newIDs = linkList.concat([linkID]);
  state[myID]._links = Object.assign({}, state[myID]._links, {
    [linkClass]: {
      list: newIDs,
      do: doLink
    }
  }); // shallow-clone state

  state = Object.assign({}, state);
  return state;
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
  return (dispatch, getState) => {
    var _me$_parent;

    let state = getState();
    const {
      myClass,
      [myID]: me
    } = state; // parent removes me

    let parentID = ((_me$_parent = me._parent) == null ? void 0 : _me$_parent.id) || null;

    if (!isFromParent && parentID) {
      var _me$_parent2;

      let doParent = (_me$_parent2 = me._parent) == null ? void 0 : _me$_parent2.do;
      doParent == null ? void 0 : doParent.removeChild(parentID, myID, myClass, true);
    } // remove children


    let children = me._children || {};
    Object.keys(children).map(eachClass => {
      let child = children[eachClass];
      child.list.map(eachID => dispatch(removeChild(myID, eachID, eachClass, false)));
    }); // remove links

    let links = me._links || {};
    Object.keys(links).map(eachClass => {
      let link = links[eachClass];
      link.list.map(eachID => dispatch(removeLink(myID, eachID, eachClass, false)));
    }); // remove me from myClass list

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

  if (!state[myID]) {
    return state;
  }

  let newIDs = (state['ids'] || []).filter(eachID => eachID != myID);
  delete state[myID];
  return Object.assign({}, state, {
    'ids': newIDs
  });
};
/***
 * remove-child
 */


const removeChild = (myID, childID, childClass, isFromChild = false) => {
  return (dispatch, getState) => {
    let relationRemove = (theDo, relationID) => theDo.remove(relationID, true);

    removeRelation(dispatch, getState, myID, childID, childClass, isFromChild, relationRemove, removeChildCore, '_children');
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
  return (dispatch, getState) => {
    let myClass = getState().myClass;

    let relationRemove = (theDo, relationID) => theDo.removeLink(relationID, myID, myClass, true);

    removeRelation(dispatch, getState, myID, linkID, linkClass, isFromLink, relationRemove, removeLinkCore, '_links');
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


const removeRelation = (dispatch, getState, myID, relationID, relationClass, isFromRelation, relationRemove, relationRemoveCore, relationName) => {
  let me = getState()[myID];
  if (!me) return;
  let relation = me[relationName][relationClass] || null;
  if (!relation) return;
  let newIDs = relation.list.filter(eachID => eachID != relationID);
  if (relation.list.length === newIDs.length) return;
  if (!isFromRelation) relationRemove(relation.do, relationID);
  dispatch(relationRemoveCore(myID, relationID, relationClass));
};

const reduceRemoveRelation = (state, myID, relationID, relationClass, relationName) => {
  let me = state[myID];
  if (!me) return state;
  let relation = me[relationName][relationClass] || null;
  if (!relation) return state;
  let relationIDs = relation.list || [];
  let newIDs = relationIDs.filter(eachID => eachID !== relationID);
  if (relationIDs.length === newIDs.length) return state; // no need to new me[relationName] or me[relationName][relationClass]

  if (newIDs.length == 0) {
    delete me[relationName][relationClass];
  } else {
    relation.list = newIDs;
  }

  state = Object.assign({}, state, {
    [myID]: Object.assign({}, state[myID])
  });
  return state;
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
  let me = state[myID];
  if (!me) return state;
  state = Object.assign({}, state, {
    [myID]: Object.assign({}, me, data)
  });
  return state;
};
/*****
 * createReducer
 *****/


// theReduceMap
const theReduceMap = {
  [INIT]: reduceInit,
  [ADD_CHILD]: reduceAddChild,
  [ADD_LINK]: reduceAddLink,
  [REMOVE]: reduceRemove,
  [REMOVE_CHILD]: reduceRemoveChild,
  [REMOVE_LINK]: reduceRemoveLink,
  [SET_DATA]: reduceSetData,
  [SET_ROOT]: reduceSetRoot
};
/***
 * createReducer
 * params: reduceMap
 */

const createReducer = reduceMap => {
  return (state, action) => {
    if (!action) {
      return state;
    }

    if (reduceMap && reduceMap[action.type]) {
      return reduceMap[action.type](state, action);
    }

    if (theReduceMap[action.type]) {
      return theReduceMap[action.type](state, action);
    }

    return state;
  };
};
/***
 * Retrieving state
 ***/


exports.createReducer = createReducer;

const getRoot = state => {
  let root = state.root || '';

  if (!root) {
    return null;
  }

  return state[root];
};

exports.getRoot = getRoot;

const getMe = (state, myID) => {
  return state[myID] || null;
};

exports.getMe = getMe;

const getChildIDs = (me, childClass) => {
  return ((me._children || {})[childClass] || {}).list || [];
};

exports.getChildIDs = getChildIDs;

const getChildID = (me, childClass) => {
  let ids = getChildIDs(me, childClass);
  return ids.length ? ids[0] : null;
};

exports.getChildID = getChildID;

const getLinkIDs = (me, linkClass) => {
  return ((me._links || {})[linkClass] || {}).list || [];
};

exports.getLinkIDs = getLinkIDs;

const getLinkID = (me, linkClass) => {
  let ids = getLinkIDs(me, linkClass);
  return ids.length ? ids[0] : null;
};
/***
 * Utils
 ***/


exports.getLinkID = getLinkID;

const _GLOBAL_IDS = new Set();

const genUUID = () => {
  let theID = '';

  while (true) {
    theID = (0, _uuid.v4)();
    if (_GLOBAL_IDS.has(theID)) continue;

    _GLOBAL_IDS.add(theID);

    break;
  }

  return theID;
};
/***
 * Components
 ***/


exports.genUUID = genUUID;

const Empty = () => /*#__PURE__*/_react.default.createElement("div", {
  style: {
    display: 'none'
  }
}, " ");

exports.Empty = Empty;