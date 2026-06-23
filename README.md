# use-thunk

[![codecov](https://codecov.io/gh/chhsiao1981/use-thunk/branch/main/graph/badge.svg)](https://codecov.io/gh/chhsiao1981/use-thunk)

A framework for easily managing global data state with `useThunk`, with [`zustand`](https://github.com/pmndrs/zustand)-like taste.

Inspired by the concepts of [Redux Thunk](https://redux.js.org/usage/writing-logic-thunks) and [Redux Duck](https://github.com/PlatziDev/redux-duck).

[src/useThunkReducer.ts](src/useThunkReducer.ts) is adapted from [nathanbuchar/react-hook-thunk-reducer](https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js).

For more information, please check [docs/00-introduction.md](docs/00-introduction.md).

For usage examples, please refer to [demo-use-thunk](https://github.com/chhsiao1981/demo-use-thunk).

## Install

    npm install @chhsiao1981/use-thunk

## Getting Started

Thunk module able to do increment (thunks/increment.ts):

```ts
import { type Thunk, type State as rState, update } from '@chhsiao1981/use-thunk'

export const name = 'demo/Increment'

export interface State extends rState {
  count: number
}

export const defaultState: State = {
  count: 0
}

// upsert directly with set.
export const increment = (myID: string, num: number = 1): Thunk<State> => {
  return async (set, get) => {
    let me = get(myID)
    const {count} = me

    set(myID, { count: count + num })
  }
}

// or we can treat set as dispatching a base action.
export const increment2 = (myID: string): Thunk<State> => {
  return async (set, get) => {
    let me = get(myID)
    const {count} = me

    set(update({ count: count + 2 }))
  }
}

// or we can use set as dispatching a thunk function.
export const increment3 = (myID: string): Thunk<State> => {
  return async (set) => {
    set(increment(myID, 3))
  }
}
```

components/App.tsx:

```tsx
import { type ThunkModuleToFunc, useThunk, getState } from '@chhsiao1981/use-thunk'
import * as DoIncrement from './thunks/increment'

type doIncrement = toDoModule(typeof DoIncrement)

export default () => {
  const useIncrement = useThunk<DoIncrement.State, doIncrement>(DoIncrement)
  const [increment, doIncrement, incrementID] = getState(useIncrement)

  // to render
  return (
    <div>
      <p>count: {increment.count}</p>
      <button onClick={() => doIncrement.increment(incrementID)}>increase 1</button>
      <button onClick={() => doIncrement.increment2(incrementID)}>increase 2</button>
      <button onClick={() => doIncrement.increment3(incrementID)}>increase 3</button>
    </div>
  )
}
```

main.tsx:
```tsx
import { registerThunk, ThunkContext } from "@chhsiao1981/use-thunk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as DoIncrement from './thunks/increment'
import App from "./components/App";

registerThunk(DoIncrement)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThunkContext>
      <App />
    </ThunkContext>
  </StrictMode>,
)
```

## Development Pattern
### Must Included in a Thunk Module

```ts
import type { State as rState } from '@chhsiao1981/use-thunk'

// Thunk-module name.
export const name = ""

// state definition of the reducer.
export interface State extends rState {
}

export const defaultState: State = {}

.
.
.
```

### Must Included in a Statically-allocated (always allocated) Component

```ts
import { type toDoModule, useThunk, getState } from '@chhsiao1981/use-thunk'
import * as DoModule from '../thunks/module'

type doModule = toDoModule<typeof DoModule>

const Component = () => {
  const useModule = useThunk<DoModule.State, doModule>(DoModule)
  const [module, doModule, moduleID] = getState(useModule)

.
.
.
}
```

### Must Included in `main.tsx`

```tsx
import { registerThunk, ThunkContext } from '@chhsiao1981/use-thunk'
import * as DoModule from '../thunks/module'
registerThunk(DoModule)
.
.
.

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThunkContext>
      <App />
    </ThunkContext>
  </StrictMode>,
)
```

## Introduction

Global state management (GSM) is tricky when developing complex ReactJS applications. [Redux/RTK](https://redux-toolkit.js.org/) and [zustand](https://zustand-demo.pmnd.rs/) focus on "We create stores that manage the global states". However, the stores can quickly become gigantic functions in complex ReacJS applications. On the other hand, `useContext` is too primitive for complex ReactJS applications.

`use-thunk` uses a different approach: All the data management is through module-based functions. With `use-thunk`:
1. We treat the files as modules, and we write the module-based functions like what we typically do in other programming languages.
2. React components can focus on data presentation, with obtaining the data from thunk modules.
3. From React components' perspective, we directly call `do[Module].function(id)`.
4. There is only 1 `ThunkContext`, which wraps around `<App />` in `main.tsx`. We no longer need to worry that the `Context` may appear in unexpected code-base and affect the underlying `useContext`.

### Normalized State

The general concept of normalized state can be found in [Normalizing State Shape](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape). We use the following hierarchy to represent the normalized states:

1. ModuleState: the state of a module, including the nodes and related information of the module.
2. NodeState: the state of a node, including the id of the node and the data (state) of the node.
3. State: the data of the node, represented as a state.

For example, the example [in the redux link](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape) is represented as:

```ts
moduleStatePost = {
  name: 'post',
  nodes: {
    [postID1] : {
      id: postID1,
      state: {
        author : userID1,
        body : "......",
        comments: [commentID1, commentID2]
      },
    },
    [postID2] : {
      id : postID2,
      state: {
        author : userID2,
        body : "......",
        comments: [commentID3, commentID4, commentID5]
      }
    }
  },
  defaultID,
  defaultState,
}
```

and:

```ts
moduleStateComment = {
  name: 'comment',
  nodes: {
    [commentID1] : {
      id: commentID1,
      state: {
        author : userID2,
        comment : ".....",
      }
    },
    [commentID2] : {
      id : commentID2,
      state: {
        author : userID3,
        comment : ".....",
      }
    },
    [commentID3] : {
      id : commentID3,
      state: {
        author : userID3,
        comment : ".....",
      }
    },
    [commentID4] : {
      id : commentID4,
      state: {
        author : userID1,
        comment : ".....",
      }
    },
    [commentID5] : {
      id : commentID5,
      state: {
        author : userID3,
        comment : ".....",
      }
    }
  }
  defaultID,
  defaultState,
}
```

and:
```ts
moduleStateUser = {
  name: 'user',
  nodes: {
    [userID1] : {
      id: userID1,
      state: {
        username : "user1",
        name : "User 1",
      }
    },
    [userID2] : {
      id: userID2,
      state: {
        username : "user2",
        name : "User 2",
      }
    },
    [userID3] : {
      id: userID3,
      state: {
        username : "user3",
        name : "User 3",
      }
    }
  }
  defaultID,
  defaultState,
}
```

## [APIs](https://github.com/chhsiao1981/use-thunk/blob/main/src/index.d.ts)

#### Types

##### `ThunkModule<S extends State>`

```ts
export type ThunkModule<S extends State> = {
  name: string
  defaultState: S

  // The rest of the variables are doModule.
  // Specifying index-signatures to include all the variables.
  [action: string]: ThunkFunc<S> | string | S
}
```

A ThunkModule represents a self-contained domain state slice implemented within a single file. It encapsulates the module's identity, its initial data structure, and the business logic workflows (thunk functions) that act upon it.

##### `ThunkFunc<S extends State>`

```ts
export type ThunkFunc<S extends State> = (...params: any[]) => Thunk<S>
```

The thunk functions in a thunk module.

##### `Thunk`

`Thunk` is defined as:

```ts
export type Thunk<S extends State> = async (
  set: set<S>,
  get: (id?: string) => S,
  getOrNull: (id?: string) => S | null | undefined,
  dispatch: dispatch<S>,
  getModuleState: () => ModuleState<S>,
) => void
```

`Thunk`s can be async functions if needed (ex: `fetch` data).

We generally use only `set` and `get`.

* `set`: can be used in the following setting:
    * `set(ThunkFunc())`: calling a thunk function.
    * `set(id, data: Partial<S>)`: upsert state of `id` (syntax sugar of `set(upsert(id, data))`).
* `get`: (Guaranteed) get the state of `id` (or `defaultID` if `id` is not present).
* `getOrNull`: get the state of `id`. Get the state of `defaultID` if `id` is not present. Return `null` if `id` or state is not available.
* `dispatch`: `dispatch(ThunkFunc())` (calling a thunk function).
* `getModuleState`: get the whole module state.

##### `doModule<S extends State>`

```ts
export interface doModule<S extends State> {
  [action: string]: ThunkFunc<S>
}
```

##### `toDoModule`

```ts
export type toDoModule<T extends ThunkModule<any>> = Omit<T, 'name' | 'defaultState'>
```

Converting `ThunkModule` to `doModule` by omitting `name` and `defaultState`.

#### RegisterThunk / ThunkContext / useThunk

##### `registerThunk(module: ThunkModule)`

Register a thunk module.

##### `<ThunkContext>{children}</ThunkContext>`

Rendering thunk context.

##### `useThunk(theDo: ThunkModule): UseThunk`

Similar to `React.useReducer`, but we use `useThunk`. In addition, we bind the thunk functions with `dispatch`, so we can directly use `do[Module].[function]()` (similar concept as `zustand`).

return: `UseThunk`

#### State

##### `getState(theUseThunk: UseThunk, id?: string): [state, doModule, theID]`

(Guaranteed) Get the state of `id` (or `defaultID` if `id` is not present) by `UseThunk`. If `defaultID` is not available, generate new ID as `defaultID`. If state is not available, clone `defaultState` as the state.

return: `[state, doModule, theID]`

#### Misc

##### `genID(): string`

Generate `id` for the state.

### Advanced Usage

#### types

##### `UseThunk`

```ts
export type UseThunk<S extends State, R extends doModule<S>> = [Readonly<ModuleState<S>>, setMap<S, R>]
```

##### `setMap`

```ts
export type setMap<S extends State, T extends doModule<S>> = {
  [action in keyof T]: VoidReturnType<T[action]>
} & Omit<DefaultSetMap, keyof T>
```

#### Primitive Thunk Functions.

##### `init({id, parentID, doParent, state})`

Initialize the state.

##### `update(id, data)`

Update the data to `id`.

##### `upsert(id, data)`

Initialize the state with `defaultState` if it does not exist, and update the data to `id`.

##### `remove(id)`

Remove the state.

#### State

##### `getStateOrNullByModule(moduleState: ModuleState, id?: string): state | null`

Get the state of `id`. Get the state of `defaultID` if `id` is not present. Return `null` if not available.

##### `getStateByModule(moduleState: ModuleState, id?: string): state`

(Guaranteed) Get the state of `id` (or `defaultID` if `id` is not present) by module state. If `defaultID` is not available, generate new ID as `defaultID`. If state is not available, clone `defaultState` as the state.
