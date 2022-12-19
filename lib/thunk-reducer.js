"use strict";

exports.__esModule = true;
exports.useThunkReducer = exports.default = void 0;
var _react = require("react");
//https://medium.com/solute-labs/configuring-thunk-action-creators-and-redux-dev-tools-with-reacts-usereducer-hook-5a1608476812

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
  const [state, dispatch] = (0, _react.useReducer)(reducer, initArg, init);
  let thunkDispatch = action => {
    if (typeof action === 'function') {
      let getState = () => state;
      // @ts-ignore because action is function
      action(thunkDispatch, getState);
    } else {
      dispatch(action);
    }
  };
  return [state, thunkDispatch];
};
exports.useThunkReducer = useThunkReducer;
var _default = useThunkReducer;
exports.default = _default;