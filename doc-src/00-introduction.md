# Introduction

## Global State Management (GSM) in ReactJS

[ReactJS](https://react.dev/) has been widely used [since the introduction in 2014](https://www.youtube.com/watch?v=nYkdrAPrdcw). ReactJS focuses on data presentation components and the local states of the React components. Since 16.8.0, ReactJS has drastically changed to function+hook styles, with `useContext` and `useReducer` (inspired by React Redux) as methods for global state management.

There have been lots of data-management frameworks for [ReactJS](https://react.dev/). Notably
[Dan Abramov](https://github.com/gaearon) and [Andrew Clark](https://github.com/acdlite)'s [React Redux](https://github.com/reduxjs/react-redux). React Redux introduced [thunk](https://redux.js.org/usage/writing-logic-thunks) ([introduced in 2015](https://egghead.io/lessons/javascript-redux-dispatching-actions-asynchronously-with-thunks)) and many other impactful programming philosophy about GSM for ReactJS, significantly impacting many GSM frameworks.

## Caveats of React Redux (and Redux Toolkit (RTK))

However, there are several caveats of React Redux / RTK:

1. We need to know `configureStore`, `createReducer`, `createSlice`, and many other definitions before good usage of React Redux / RTK.
2. Need to know relationship between action and reducer.
3. Most of the definitions are in the `createSlice` functions. These functions can be complex gigantic functions in a complex app.
4. Not really about "objects-of-the-same-kind" and requires developers have their own method. `Redux` recommends [normalized states](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape).
5. Several redundant code when programming.

## Caveats of zustand

Recently [zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction) significantly simplify the use of Redux / RTK. However:

1. Still requires developers have their own methods for "objects-of-the-same-kind".
2. We still need to know the relationship between store vs. slice (`useBoundStore`).
3. I feel that the [`createBearFishSlice`](https://zustand.docs.pmnd.rs/learn/guides/slices-pattern#updating-multiple-stores) example is actually awkward. Why do we need to create additional slices if we want to update the states from multiple slices?

## Modularized Thunk is All We Need

React Redux, zustand, and many other GSM frameworks focus on: "We have stores (ideally a single store as single-source-of-truth) that manage the states. How do we manage the stores."

Instead of focusing on the stores, use-thunk uses a different approach: "We have objects that need to be managed. How do we group the objects to modules and manage the states of the objects through modularized operations." The modularized operations are implemented through thunks.

## Goals of use-thunk

The primary objective of use-thunk is to streamline global state management in ReactJS by decoupling component rendering from business logic, eliminating boilerplate, and enforcing a highly maintainable, modular structure without the historical friction of React Redux.

1. Separation of Concerns

   Following the foundational paradigm of React Redux, use-thunk enforces a strict separation between UI components and data management. Components focus entirely on layout and rendering, while business logic resides securely within decoupled domain modules.

2. Unified Action-Reducer Architecture

    The traditional, verbose distinction between actions and reducers is eliminated:

    * Primitive Mutators (CUD): State mutations are restricted to built-in, predictable primitive operations (init, upsert, update, remove) that handle core data persistence.

    * Thunk Orchestrators: Action logic handles all computational overhead, side effects, and async flows, internally dispatching to the primitive mutators to update state.

3. Modular Programming Paradigm

    The development experience is designed to mirror standard file-based module systems found in modern programming languages (e.g., Go, Python), rather than relying on complex Object-Oriented Programming (OOP) abstractions.

    * File-as-Module Structure: Developers write state logic as standard JavaScript/TypeScript modules. This approach eliminates OOP complexities like inheritance, polymorphism, and abstract factories in favor of pure, functional modularity.

    * Isolated Encapsulation: Each module governs its own distinct slice of the state. Cross-module state mutation is strictly forbidden; a module can only affect another module’s state indirectly by invoking its exposed public functions.

    * Component Interface Simplicity: Components do not require a `dispatch` reference. They interact with state by directly invoking clean, module-scoped functions, minimizing inline data manipulation.

4. Data Topography & Object Identification

    Data access and manipulation are designed to be intuitive, explicit, and safe:

    * Direct Object Representation (Read): When consuming data, the state is exposed directly as a native, immutable JavaScript/TypeScript object (`{}`), ensuring predictable copy-on-write behavior.

    * Discrete Entity Nodes: The module stores data as isolated, identifiable entity nodes. By utilizing explicit `id` parameters, operations are strictly scoped to a target entity, eliminating accidental collateral state updates.

    * Singleton Fallback: The `id` parameter in a module is entirely optional. When omitted, the module gracefully falls back with a uniquely identified default id (different for different modules).

## Implementation

To achieve the goals:

1. Heavily use the concept of `Thunk`, to be able to have multiple computations/reductions in one operation.
2. With the concept of "[normalized state](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)" in mind:
    * `State`: the state of each object.
    * `NodeState`: the metadata of each object, including the `id` and `State`.
    * `ModuleState`: the collection of `NodeState` in a module.
3. The thunk functions are automatically attached with `dispatch` when used by the components. There is no need to use `dispatch` in components.
4. API mainly exposes accessing module-based thunk functions, but reading only object-state-based data.
5. Primitive thunk functions (init, upsert, update, remove) are implemented interally. The developers just call these primitive thunk functions to update the object-state.
6. Use `useSyncExternalStore` to achieve object-state based re-rendering.
7. Rename `dispatch` / `getState` to `set` / `get` / `getOrNull` / `dispatch` / `getModuleState` for extended and easier to use.

### Primitive Thunk Functions

`Primitive thunk functions` are similar to the original actions in Redux.

We provide the following default primitive thunk functions:

* `init`: initialize an object-state.
* `upsert`: update the object-state, with initialization first if not exist.
* `update`: update the object-state.
* `remove`: remove the object-state.
