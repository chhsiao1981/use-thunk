# How It Works

## [ThunkModuleMap](https://github.com/chhsiao1981/use-thunk/blob/main/src/thunkModule/thunkModuleMap.ts): the Single Source of Truth

All the states are managed in a single source of truth: [ThunkModuleMap](https://github.com/chhsiao1981/use-thunk/blob/main/src/thunkModule/thunkModuleMap.ts).

## Object-`State`

Object-states are typically used for component-presentation. Therefore, Object-states require renew as new objects after each operation for ReactJS to detect the change of the state.

## `ModuleState` and `NodeState`

We realized that developers care only the object-states. `ModuleState`s are registered through [`registerThunk`](https://github.com/chhsiao1981/use-thunk/blob/main/src/registerThunk.ts) and never renewed as new objects after each operation. `NodeState`s are never renewed during [`update`](https://github.com/chhsiao1981/use-thunk/blob/main/src/defaultThunkFuncs/update.ts#L61) or [`upsert`](https://github.com/chhsiao1981/use-thunk/blob/main/src/defaultThunkFuncs/upsert.ts#L66). This approach enables us to have `getStateByModule` to obtain the newest object-state while keeping object-states copy-on-write.

## Following Action-Dispatch-Reducer Pattern Under The Hood.

Despite that we need only the thunk modules when using `use-thunk`, the implementation heavily utilizes action-dispatch-reducer pattern under the hood:

* The implementation of `dispatch` can be found [here](https://github.com/chhsiao1981/use-thunk/blob/main/src/useThunk/useThunkReducer.ts#L50).
* [`getModuleState`](https://github.com/chhsiao1981/use-thunk/blob/main/src/useThunk/useThunkReducer.ts#L36) can be viewed as [the original `getState` in Redux Thunk](https://redux.js.org/usage/writing-logic-thunks).
* [`set`](https://github.com/chhsiao1981/use-thunk/blob/main/src/useThunk/useThunkReducer.ts#L98) is `dispatch` and the syntax sugar of `dispatch(upsert(id, data))`.
* [`get`](https://github.com/chhsiao1981/use-thunk/blob/main/src/useThunk/useThunkReducer.ts#L45) is the syntax sugar of getting the object-state from module state.
* [`getOrNull`](https://github.com/chhsiao1981/use-thunk/blob/main/src/useThunk/useThunkReducer.ts#L40) is the variation of `get`.

## Reducers: [Only Primitive Reducers](https://github.com/chhsiao1981/use-thunk/blob/main/src/reducer/defaultReduceMap.ts)

We recognize that state management requires only `init`, `get`, `update`, and `remove` ([CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)). Furthermore, in most cases, only `upsert` and `get` are needed. Therefore, our implementation provides [only these primitive reducers](https://github.com/chhsiao1981/use-thunk/blob/main/src/reducer/defaultReduceMap.ts).

## Separation of `doModule` and `ModuleState`

Unlike the selector pattern used by RTK and Zustand, we believe that data and operations should be separated to improve maintainability, since the same module functions should be able to operate on different objects. Therefore, we provide [`doMod`](https://github.com/chhsiao1981/use-thunk/blob/main/src/thunkModule/doModule.ts#L69) for accessing module functions and [`getMod`](https://github.com/chhsiao1981/use-thunk/blob/main/src/thunkModule/thunkModuleMap.ts#L22) for accessing module state.

## Object-based Re-rendering

Starting 16.1.0, we use [`useSyncExternalStore`](https://github.com/chhsiao1981/use-thunk/blob/main/src/useThunk/useThunkReducer.ts#L23) for [each object](https://github.com/chhsiao1981/use-thunk/blob/main/src/states/node.ts#L41) to achieve object-based re-rendering.
