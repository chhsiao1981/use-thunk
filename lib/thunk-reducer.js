"use strict";

exports.__esModule = true;
exports.useThunkReducer = exports.default = void 0;
var _react = require("react");
//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812
//https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js
//
//The built-in useReducer does not immediately evaluate the dispatch if called within useEffect.
//Sometimes we do want such immediate evaluation feature for easier implementation.
//(We don't want lots of useEffect in the components.)

/**
 * useThunkReducer
 *
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {S} initArg
 * @param {Function} [init]
 * @returns {[S, Dispatch]}
 */
const useThunkReducer = (reducer, initArg, init = s => s) => {
  const [hookState, setHookState] = (0, _react.useState)(() => init(initArg));

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

  // augmented dispatcher.
  const dispatch = (0, _react.useCallback)(action => {
    return typeof action === 'function'
    // @ts-ignore because action is function
    ? action(dispatch, getState) : setState(reduce(action));
  }, [getState, setState, reduce]);
  return [hookState, dispatch];
};
exports.useThunkReducer = useThunkReducer;
var _default = useThunkReducer;
exports.default = _default;