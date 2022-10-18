"use strict";

exports.__esModule = true;
exports.useThunkReducer = exports.default = void 0;
var _react = require("react");
/**
 * @function Thunk
 * @param {Dispatch} dispatch
 * @param {Function} getState
 * @returns {void|*}
 */

/**
 * @function Dispatch
 * @param {Object|rThunk} action
 * @returns {void|*}
 */

/**
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {*} initialArg
 * @param {Function} [init]
 * @returns {[*, Dispatch]}
 */
const useThunkReducer = (reducer, initialArg, init = s => s) => {
  const [hookState, setHookState] = (0, _react.useState)(() => init(initialArg));

  // State management.
  const state = (0, _react.useRef)(hookState);
  const getState = (0, _react.useCallback)(() => state.current, [state]);
  const setState = (0, _react.useCallback)(newState => {
    state.current = newState;
    setHookState(newState);
  }, [state, setHookState]);

  // Reducer.
  const reduce = (0, _react.useCallback)(action => {
    return reducer(getState(), action);
  }, [reducer, getState]);

  // Augmented dispatcher.
  const dispatch = (0, _react.useCallback)(action => {
    return typeof action === 'function' ? action(dispatch, getState) : setState(reduce(action));
  }, [getState, setState, reduce]);
  return [hookState, dispatch];
};
exports.useThunkReducer = useThunkReducer;
var _default = useThunkReducer;
exports.default = _default;