# How It Works

## [ThunkModuleMap](https://github.com/chhsiao1981/use-thunk/blob/main/src/thunkContext/thunkModuleMap.ts): the Single Source of Truth

## Object-`State`

Object-states are typically used for component-presentation. Therefore, Object-states require renew as new objects after each operation for ReactJS to detect the change of the state.

## `ModuleState` and `NodeState`

We realized that developers mostly care only the object-states. `ModuleState` and `NodeState` are never renewed as new objects after each operations. This approach enables us to have `getStateByModule` to obtain the newest object-state while keeping object-states copy-on-write.

## Separation of `doModule` and `ModuleState`

Within a module, we realized that data and operations can be separated for easy maintenance, as there should be same module functions operating on different objects. Therefore, we have `doMod` to get the module functions, and `getMod` to get the module states.

## Object-based Re-rendering

Starting 16.0.0, we use `useSyncExternalStore` for each object to achieve object-based re-rendering.

## Reducer: Only Primitive Reducers
