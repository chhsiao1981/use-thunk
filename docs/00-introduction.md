# use-thunk

## Caveats of `React Redux`

There have been lots of data-management frameworks for [ReactJS](https://react.dev/). Notably
[Dan Abramov](https://github.com/gaearon)'s [React Redux](https://github.com/reduxjs/react-redux),
and the corresponding [Thunk](https://github.com/reduxjs/redux-thunk).

However, there are several caveats of `React Redux`:
1. Requiring `Provider` when using `React Redux`.
2. A single global state, which can contaminate with each other for different reducers.
3. Actions and reducers are kind of redundant with each other, as we can:
    * simply provide action objects to the reducers, and let the reducers do all the computation for reduction, or
    * have the actions do all the computations and provide the data objects to the reducers, and let the reducers simply put the data objects to the corresponding states.
4. Requiring `dispatch` every time we want to do some actions.

## Goals of `use-thunk`

`use-thunk` intends to simplify `react redux` with the following goals:
1. Same as `react redux`, separating components and reducers.
2. **There is no need to differentiate between actions and reducers**.
    * reducers: use `setData` to do `Object.assign({}, state, action-object)`.
    * actions: do all the computation and do `dispatch(setData(myID, action-object))` multiple times.
    * **For easy of understanding, actions/reducers are integrated and named as "thunk" in this repository and starting from this sentence.**
3. When doing programming:
    * **The thunk should be like programming a typical `js`/`ts` module.**
    * The components should be focusing only on component-rendering, with as least data manipulation as possible.
    * **There is no need to specify `dispatch` in components**.
    * Following modularization pattern, each class of the thunk has its own state. Different thunks cannot directly access the states of other thunks. We can access the states only indirectly through the functions of the thunks.

## Implementation

To achieve the goals:
1. With the concept of "[normalized state](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)" in mind:
    * `State`: the state of each object.
    * `NodeState`: the metadata of each object, including the `id` and `State`.
    * `ClassState`: the collection of `NodeState` by reducer-module.
2. Heavily use the concept of `Thunk`, to be able to have multiple reductions in one operation.
3. The thunk functions are automatically attached with `dispatch` in the react components.
4. The thunk functions are still the unattached functions in the thunk modules. We still need to use `dispatch` when calling these functions in the thunk modules.

### Primitive Reducers

`Primitive reducers` are similar to the original "redux' reducers".
There is actually also the "redux' action" part in a primitive reducer.
However, the purpose of the "redux' action" part is only to provide
the object-based actions (`{}`) to the "redux' reducers".

**The map between the `primitive reducer actions` (redux' actions)
and `primitive reducer functions` (redux' reducers)
is defined in [DEFAULT_REDUCE_MAP](../src/reduceMap.ts).**

`Primitive reducers` are simply for internal reductions for **the thunk modules**
and are **not** supposed to be accessible in **the components**.

We provide the following default primitive reducers:
* init: initialize an object-state.
* setData: update the object-state.
* remove: remove the object-state.
