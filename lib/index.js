"use strict";

exports.__esModule = true;
exports.Empty = exports.genUUID = exports.getLinkID = exports.getLinkIDs = exports.getChildID = exports.getChildIDs = exports.getMe = exports.getRoot = exports.createReducer = exports.setData = exports.removeLink = exports.removeChild = exports.remove = exports.addLink = exports.addChild = exports.init = exports.useActionDispatchReducer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _uuid = _interopRequireDefault(require("uuid"));

var _reactHookThunkReducer = _interopRequireDefault(require("react-hook-thunk-reducer"));

var _theReduceMap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**********
 * useActionDispatcherReducer
 **********/
var useActionDispatchReducer = function useActionDispatchReducer(action) {
  var _useThunkReducer = (0, _reactHookThunkReducer["default"])(action["default"], {}),
      state = _useThunkReducer[0],
      dispatch = _useThunkReducer[1];

  var boundDispatchAction = Object.keys(action).filter(function (each) {
    return each !== 'default';
  }).reduce(function (val, each, idx) {
    val[each] = function () {
      return dispatch(action[each].apply(action, arguments));
    };

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

var init = function init(_ref) {
  var myID = _ref.myID,
      myClass = _ref.myClass,
      doMe = _ref.doMe,
      parentID = _ref.parentID,
      doParent = _ref.doParent,
      links = _ref.links,
      params = _objectWithoutPropertiesLoose(_ref, ["myID", "myClass", "doMe", "parentID", "doParent", "links"]);

  if (!myID) myID = genUUID();
  return function (dispatch, getState) {
    dispatch(initCore(_extends({
      myID: myID,
      myClass: myClass,
      doMe: doMe,
      parentID: parentID,
      doParent: doParent
    }, params)));

    if (links) {
      links.map(function (each) {
        return dispatch(addLink(myID, each));
      });
    }

    if (parentID) {
      doParent.addChild(parentID, myID, myClass, doMe);
    } else {
      dispatch(setRoot(myID));
    }
  };
};

exports.init = init;
var INIT = 'react-reducer-state/INIT';

var initCore = function initCore(_ref2) {
  var myID = _ref2.myID,
      myClass = _ref2.myClass,
      doMe = _ref2.doMe,
      parentID = _ref2.parentID,
      doParent = _ref2.doParent,
      params = _objectWithoutPropertiesLoose(_ref2, ["myID", "myClass", "doMe", "parentID", "doParent"]);

  return _extends({
    myID: myID,
    type: INIT,
    myClass: myClass,
    doMe: doMe,
    parentID: parentID,
    doParent: doParent
  }, params);
};

var reduceInit = function reduceInit(state, action) {
  var _extends2;

  var myID = action.myID,
      _ = action.type,
      myClass = action.myClass,
      doMe = action.doMe,
      parentID = action.parentID,
      doParent = action.doParent,
      params = _objectWithoutPropertiesLoose(action, ["myID", "type", "myClass", "doMe", "parentID", "doParent"]);

  var newList = (state.ids || []).concat([myID]);
  return _extends({}, state, (_extends2 = {
    myClass: myClass,
    doMe: doMe,
    ids: newList
  }, _extends2[myID] = _extends({
    _children: {},
    _parent: {
      parentID: parentID,
      doParent: doParent
    },
    _links: {},
    id: myID
  }, params), _extends2));
};
/***
 * setRoot
 */


var SET_ROOT = 'react-reducer-state/SET_ROOT';

var setRoot = function setRoot(myID) {
  return {
    myID: myID,
    type: SET_ROOT
  };
};

var reduceSetRoot = function reduceSetRoot(state, action) {
  var myID = action.myID;
  return _extends({}, state, {
    root: myID
  });
};
/***
 * addChild
 */


var ADD_CHILD = 'react-reducer-state/ADD_CHILD';

var addChild = function addChild(myID, childID, childClass, doChild) {
  return {
    myID: myID,
    type: ADD_CHILD,
    childID: childID,
    childClass: childClass,
    doChild: doChild
  };
};

exports.addChild = addChild;

var reduceAddChild = function reduceAddChild(state, action) {
  var _extends3;

  var myID = action.myID,
      childID = action.childID,
      childClass = action.childClass,
      doChild = action.doChild;

  if (!state[myID]) {
    return state;
  }

  var newIDs = ((state[myID]._children[childClass] || {}).list || []).concat([childID]);
  state[myID]._children = _extends({}, state[myID]._children, (_extends3 = {}, _extends3[childClass] = {
    list: newIDs,
    "do": doChild
  }, _extends3));
  state = _extends({}, state);
  return state;
};
/***
 * addLink
 */


var addLink = function addLink(myID, link, isFromLink) {
  if (isFromLink === void 0) {
    isFromLink = false;
  }

  return function (dispatch, getState) {
    dispatch(addLinkCore(myID, link));

    if (!isFromLink) {
      var _getState = getState(),
          myClass = _getState.myClass,
          doMe = _getState.doMe;

      link["do"].addLink(link.id, {
        id: myID,
        myClass: myClass,
        "do": doMe
      }, true);
    }
  };
};

exports.addLink = addLink;
var ADD_LINK = 'react-reducer-state/ADD_LINK';

var addLinkCore = function addLinkCore(myID, link) {
  return {
    myID: myID,
    type: ADD_LINK,
    link: link
  };
};

var reduceAddLink = function reduceAddLink(state, action) {
  var _extends4;

  var myID = action.myID,
      link = action.link;
  var me = state[myID];
  if (!me) return;
  var linkClass = link.myClass,
      linkID = link.id,
      doLink = link["do"];
  var newIDs = ((state[myID]._links[linkClass] || {}).list || []).concat([linkID]); // no need to update _links[linkClass]

  state[myID]._links = _extends({}, state[myID]._links, (_extends4 = {}, _extends4[linkClass] = {
    list: newIDs,
    "do": doLink
  }, _extends4)); // shallow-clone state

  state = _extends({}, state);
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


var remove = function remove(myID, isFromParent) {
  if (isFromParent === void 0) {
    isFromParent = false;
  }

  return function (dispatch, getState) {
    var state = getState();
    var myClass = state.myClass,
        me = state[myID];
    var parentID = me._parent.parentID || null;

    if (!isFromParent && parentID) {
      var doParent = me._parent.doParent;
      doParent.removeChild(parentID, myID, myClass, true);
    }

    Object.keys(me._children).map(function (eachClass) {
      var child = me._children[eachClass];
      child.list.map(function (eachID) {
        return dispatch(removeChild(myID, eachID, eachClass, false));
      });
    });
    Object.keys(me._links).map(function (eachClass) {
      var link = me._links[eachClass];
      link.list.map(function (eachID) {
        return dispatch(removeLink(myID, eachID, eachClass, false));
      });
    });
    dispatch(removeCore(myID));
  };
};

exports.remove = remove;
var REMOVE = 'react-reducer-state/REMOVE';

var removeCore = function removeCore(myID) {
  return {
    myID: myID,
    type: REMOVE
  };
};

var reduceRemove = function reduceRemove(state, action) {
  var myID = action.myID;
  var me = state[myID];

  if (!me) {
    return state;
  }

  var newIDs = (state['ids'] || []).filter(function (eachID) {
    return eachID != myID;
  });
  delete state[myID];
  return _extends({}, state, {
    'ids': newIDs
  });
};
/***
 * remove-child
 */


var removeChild = function removeChild(myID, childID, childClass, isFromChild) {
  if (isFromChild === void 0) {
    isFromChild = false;
  }

  return function (dispatch, getState) {
    var myClass = getState().myClass;

    var relationRemove = function relationRemove(theDo, relationID) {
      return theDo.remove(relationID, true);
    };

    removeRelation(dispatch, getState, myID, childID, childClass, isFromChild, relationRemove, removeChildCore, '_children');
  };
};

exports.removeChild = removeChild;
var REMOVE_CHILD = 'react-reducer-state/REMOVE_CHILD';

var removeChildCore = function removeChildCore(myID, childID, childClass) {
  return {
    myID: myID,
    type: REMOVE_CHILD,
    childID: childID,
    childClass: childClass
  };
};

var reduceRemoveChild = function reduceRemoveChild(state, action) {
  var myID = action.myID,
      childID = action.childID,
      childClass = action.childClass;
  return reduceRemoveRelation(state, myID, childID, childClass, '_children');
};
/***
 * remove-link
 */


var removeLink = function removeLink(myID, linkID, linkClass, isFromLink) {
  if (isFromLink === void 0) {
    isFromLink = false;
  }

  return function (dispatch, getState) {
    var myClass = getState().myClass;

    var relationRemove = function relationRemove(theDo, relationID) {
      return theDo.removeLink(relationID, myID, myClass, true);
    };

    removeRelation(dispatch, getState, myID, linkID, linkClass, isFromLink, relationRemove, removeLinkCore, '_links');
  };
};

exports.removeLink = removeLink;
var REMOVE_LINK = 'react-reducer-state/REMOVE_LINK';

var removeLinkCore = function removeLinkCore(myID, linkID, linkClass) {
  return {
    myID: myID,
    type: REMOVE_LINK,
    linkID: linkID,
    linkClass: linkClass
  };
};

var reduceRemoveLink = function reduceRemoveLink(state, action) {
  var myID = action.myID,
      linkID = action.linkID,
      linkClass = action.linkClass;
  return reduceRemoveRelation(state, myID, linkID, linkClass, '_links');
};
/***
 * remove-relation
 */


var removeRelation = function removeRelation(dispatch, getState, myID, relationID, relationClass, isFromRelation, relationRemove, relationRemoveCore, relationName) {
  var me = getState()[myID];
  if (!me) return;
  var relation = me[relationName][relationClass] || null;
  if (!relation) return;
  var newIDs = relation.list.filter(function (eachID) {
    return eachID != relationID;
  });
  if (relation.list.length === newIDs.length) return;
  if (!isFromRelation) relationRemove(relation["do"], relationID);
  dispatch(relationRemoveCore(myID, relationID, relationClass));
};

var reduceRemoveRelation = function reduceRemoveRelation(state, myID, relationID, relationClass, relationName) {
  var _extends5;

  var me = state[myID];
  if (!me) return state;
  var relation = me[relationName][relationClass] || null;
  if (!relation) return state;
  var relationIDs = relation.list;
  var newIDs = relationIDs.filter(function (eachID) {
    return eachID !== relationID;
  });
  if (relationIDs.length === newIDs.length) return state; // no need to new me[relationName] or me[relationName][relationClass]

  if (newIDs.length == 0) {
    delete me[relationName][relationClass];
  } else {
    relation.list = newIDs;
  }

  state = _extends({}, state, (_extends5 = {}, _extends5[myID] = _extends({}, state[myID]), _extends5));
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


var SET_DATA = 'react-reducer-state/SET_DATA';

var setData = function setData(myID, data) {
  return {
    myID: myID,
    type: SET_DATA,
    data: data
  };
};

exports.setData = setData;

var reduceSetData = function reduceSetData(state, action) {
  var _extends6;

  var myID = action.myID,
      data = action.data;
  var me = state[myID];
  if (!me) return state;
  state = _extends({}, state, (_extends6 = {}, _extends6[myID] = _extends({}, me, data), _extends6));
  return state;
}; // theReduceMap


var theReduceMap = (_theReduceMap = {}, _theReduceMap[INIT] = reduceInit, _theReduceMap[ADD_CHILD] = reduceAddChild, _theReduceMap[ADD_LINK] = reduceAddLink, _theReduceMap[REMOVE] = reduceRemove, _theReduceMap[REMOVE_CHILD] = reduceRemoveChild, _theReduceMap[REMOVE_LINK] = reduceRemoveLink, _theReduceMap[SET_DATA] = reduceSetData, _theReduceMap[SET_ROOT] = reduceSetRoot, _theReduceMap);
/*****
 * createReducer
 *****/

/***
 * createReducer
 * params: reduceMap
 */

var createReducer = function createReducer(reduceMap) {
  return function (state, action) {
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

var getRoot = function getRoot(state) {
  return state[state.root];
};

exports.getRoot = getRoot;

var getMe = function getMe(state, myID) {
  return state[myID];
};

exports.getMe = getMe;

var getChildIDs = function getChildIDs(me, childClass) {
  return (me._children[childClass] || {}).list || [];
};

exports.getChildIDs = getChildIDs;

var getChildID = function getChildID(me, childClass) {
  var ids = getChildIDs(me, childClass);
  return ids.length ? ids[0] : null;
};

exports.getChildID = getChildID;

var getLinkIDs = function getLinkIDs(me, linkClass) {
  return (me._links[linkClass] || {}).list || [];
};

exports.getLinkIDs = getLinkIDs;

var getLinkID = function getLinkID(me, linkClass) {
  var ids = getLinkIDs(me, childClass);
  return ids.length ? ids[0] : null;
};
/***
 * Utils
 ***/


exports.getLinkID = getLinkID;

var _GLOBAL_IDS = new Set();

var genUUID = function genUUID() {
  var theID = '';

  while (true) {
    theID = _uuid["default"].v4();
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

var Empty = function Empty() {
  return _react["default"].createElement("div", null);
};

exports.Empty = Empty;