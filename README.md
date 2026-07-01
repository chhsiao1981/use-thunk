# use-thunk

[![codecov](https://codecov.io/gh/chhsiao1981/use-thunk/branch/main/graph/badge.svg)](https://codecov.io/gh/chhsiao1981/use-thunk)

A framework for easily managing global data state with `useThunk`, with [`zustand`](https://github.com/pmndrs/zustand)-like taste.

Inspired by the concepts of [Redux Thunk](https://redux.js.org/usage/writing-logic-thunks) and [Redux Duck](https://github.com/PlatziDev/redux-duck).


For usage examples, please refer to [demo-use-thunk](https://github.com/chhsiao1981/demo-use-thunk) and [demo-use-thunk-tic-tac-toe](https://github.com/chhsiao1981/demo-use-thunk-tic-tac-toe).

## Acknowledgement

* [useThunkReducer.ts](src/useThunk/useThunkReducer.ts) is adapted from [nathanbuchar/react-hook-thunk-reducer](https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js). Copyright (c) 2019 Nathan Buchar <hello@nathanbuchar.com> under MIT License.
* 16.0.0 is based on the comments from [reddit discussion](https://www.reddit.com/r/reactjs/comments/1ufttri/usethunk_a_much_simplified_globalstatemanagement/). I thank [Obvious-Monitor8510](https://www.reddit.com/user/Obvious-Monitor8510/), [WanderWatterson](https://www.reddit.com/user/WanderWatterson/), [Honey-Entire](https://www.reddit.com/user/Honey-Entire/), and [OxidalWave](https://www.reddit.com/user/OxidalWave/) for their valuable feedback.


## Install

    npm install @chhsiao1981/use-thunk

## Getting Started

### `id`-based Usage
A complete example to do increment:

```ts
// thunks/increment.ts
import { type Thunk, type State as _State, update } from '@chhsiao1981/use-thunk'

export const name = 'demo/Increment'

export interface State extends _State {
  count: number
}

export const defaultState: State = {
  count: 0
}

// upsert directly with set.
export const increment = (id: string, num: number = 1): Thunk<State> => {
  return async (set, get) => {
    let me = get(id)
    const {count} = me

    set(id, { count: count + num })
  }
}

// or we can treat set as dispatching a base action function (update).
export const increment2 = (id: string): Thunk<State> => {
  return async (set, get) => {
    let me = get(id)
    const {count} = me

    set(update(id, { count: count + 2 }))
  }
}

// or we can use set as dispatching a thunk function.
export const increment3 = (id: string): Thunk<State> => {
  return async (set) => {
    set(increment(id, 3))
  }
}
```

```tsx
// components/App.tsx
import { useThunk, getState } from '@chhsiao1981/use-thunk'
import * as ModIncrement from './thunks/increment'

export default () => {
  const [increment, doIncrement, incrementID] = useThunk<ModIncrement.State, typeof ModIncrement>(ModIncrement)

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

```tsx
// main.tsx
import { registerThunk, ThunkContext } from "@chhsiao1981/use-thunk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as ModIncrement from './thunks/increment'
import App from "./components/App";

registerThunk(ModIncrement)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThunkContext>
      <App />
    </ThunkContext>
  </StrictMode>,
)
```

### `id`-less Usage
The `id` can be omitted if we have only 1 data-obj in the thunk module.
For example, the previous increment example can be simplified as follow:

```ts
// thunks/increment.ts
import { type Thunk, type State as _State, update } from '@chhsiao1981/use-thunk'

export const name = 'demo/Increment'

export interface State extends _State {
  count: number
}

export const defaultState: State = {
  count: 0
}

// upsert directly with set.
export const increment = (num: number = 1): Thunk<State> => {
  return async (set, get) => {
    let me = get()
    const {count} = me

    set(null, { count: count + num })
  }
}

// or we can treat set as dispatching a base action function (update).
export const increment2 = (): Thunk<State> => {
  return async (set, get) => {
    let me = get()
    const {count} = me

    set(update({ count: count + 2 }))
  }
}

// or we can use set as dispatching a thunk function.
export const increment3 = (): Thunk<State> => {
  return async (set) => {
    set(increment(3))
  }
}
```

```tsx
// components/App.tsx
import { useThunk, getState } from '@chhsiao1981/use-thunk'
import * as ModIncrement from './thunks/increment'

export default () => {
  const [increment, doIncrement] = useThunk<ModIncrement.State, typeof ModIncrement>(ModIncrement)

  // to render
  return (
    <div>
      <p>count: {increment.count}</p>
      <button onClick={() => doIncrement.increment()}>increase 1</button>
      <button onClick={() => doIncrement.increment2()}>increase 2</button>
      <button onClick={() => doIncrement.increment3()}>increase 3</button>
    </div>
  )
}
```

```tsx
// main.tsx
import { registerThunk, ThunkContext } from "@chhsiao1981/use-thunk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as ModIncrement from './thunks/increment'
import App from "./components/App";

registerThunk(ModIncrement)

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
import type { State as _State } from '@chhsiao1981/use-thunk'

// Thunk-module name.
export const name = ""

// state definition of the reducer.
export interface State extends _State {
}

export const defaultState: State = {}

export const func = (): Thunk<State> => {
  return async (set, get) => {
  }
}

.
.
.
```

### Must Included in a Statically-allocated (always allocated) Component

```ts
import { useThunk, getState } from '@chhsiao1981/use-thunk'
import * as ModModule from '../thunks/module'

const Component = () => {
  const [state, doModule, id] = useThunk<ModModule.State, typeof ModModule>(ModModule)

.
.
.
}
```

### Must Included in `main.tsx`

```tsx
import { registerThunk, ThunkContext } from '@chhsiao1981/use-thunk'
import * as ModModule from '../thunks/module'
registerThunk(ModModule)
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

Global state management (GSM) is tricky for complicated reactjs applications. [Redux/RTK](https://redux-toolkit.js.org/) and [zustand](https://zustand-demo.pmnd.rs/) focus on "We create stores that manage the global states". However, the stores can quickly become gigantic functions in complex ReacJS applications. On the other hand, `useContext` is too primitive for complex ReactJS applications.

`use-thunk` uses a different approach: All the data management is through module-based functions. With `use-thunk`:
1. **File-as-Module**: We treat the files as modules, and we write the module-based functions like what we typically do in other programming languages.
2. **Object Identification**: The module manages state as discrete entity nodes. We use explicit id parameters to identify and operate on individual data objects within that module cleanly. The id can be optional and it will fallback to singleton with id-less usage.
3. **Clean Component Interface**: From the component perspective, we simply invoke the module's functions to perform operations.
4. **Only One Context Provider**: Unlike standard useContext or Redux architectures that require nesting endless providers, we only need exactly one `<ThunkContext></ThunkContext>` wrap in our `main.tsx`. It entirely eliminates "Provider Hell" and the architectural uncertainty of managing stacked providers.

### Analogy: useThunk vs. useContext and useThunk vs. Redux Thunk

`use-thunk` is based on [useContext](https://react.dev/reference/react/useContext). We can make analogy between `use-thunk` and `useContext`:

* `registerThunk` <=> `createContext`.
* `<ThunkContext></ThunkContext>` <=> `<Context></Context>`.
* `useThunk` <=> `useContext`.

[`Thunk` parameters](#thunk) are based on [Redux Thunk](https://redux.js.org/usage/writing-logic-thunks). We can make analogy between `Thunk` parameters and Redux Thunk:
* `set` => enhanced `dispatch`.
* `get` => `getState` (guaranteed getting state).
* `getOrNull` => `getState` (`null` if state not available).
* `dispatch` => original `dispatch`.
* `getModuleState` => `getState` (module-wise `getState`).

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

### Typical Usage
We mostly need only the following APIs:

#### Types

##### `State`

```ts
export interface State {
  [key: string]: unknown
}
```

`State` is the most fundamental type for the states in `ThunkModule`s.

##### `ThunkModule<S extends State>`

```ts
export type ThunkModule<S extends State> = {
  name: string // module name. convention: [project-name]/[module].
  defaultState: S // default state.

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

A thunk function in a thunk module. Thunk function is a function returning thunk.

##### `Thunk`

Primitively, `Thunk` is defined as:

```ts
export type Thunk<S extends State> = async (
  set: set<S>,
  get: (id?: string) => S,
) => void
```

`Thunk`s can be async functions if needed (ex: `fetch` data).

* `set`: can be used in the following setting:
    * `set(ThunkFunc())`: evaluate a thunk function.
    * `set(id: string | null | undefined, data: Partial<S>)`: upsert state of `id` (syntax sugar of `set(upsert(id, sdata))`).
* `get(id?: string | null | undefined)`: (Guaranteed) get the state of `id` (or `defaultID` if `id` is not present).

Full definition of `Thunk` is in the [Advanced Usage](#advanced-usage) section.

#### RegisterThunk / ThunkContext / useThunk

##### `registerThunk(module: ThunkModule)`

```ts
const registerThunk = <S extends State>(module: ThunkModule<S>) => void
```
Register a thunk module.

##### `<ThunkContext>{children}</ThunkContext>`

Rendering thunk context. Always wraps `<App />` in `main.tsx`.

##### `useThunk(theDo: ThunkModule): [state, doModule, id]`

```ts
const useThunk = <S extends State, T extends ThunkModule<S>>(module: T, id?: string) => [state: Readonly<S>, doModule: toDoModule<S, T>, string]
```

Get the state of the id, doModule, and the id.

return: `[state, doModule, id]`.

#### Module Related

##### doMod

```ts
const doMod = <S extends State, T extends ThunkModule<S>>(moduleName: string)
```

Get the doModule by module name.

##### type doModule

```ts
type doModule<S extends State, T extends ThunkModule<S>> = {
  // @ts-expect-error toThunkFuncMap includes only ThunkFunc<S> | BaseActionFunc
  [action in keyof toThunkFuncMap<T>]: VoidReturnType<toThunkFuncMap<T>[action]>
} & Omit<defaultDoModule, keyof toThunkFuncMap<T>>
```

Functions in `doModule` already wrap thunk functions with set (`dispatch` in `Redux` / `useReducer`). `doModule` functions can be directly used. We don't wrap `doModule` functions with `set`/`dispatch`.

##### getMod

```ts
const getMod = <S extends State>(moduleName: string): Readonly<ModuleState<S>>
```

Get the module state by module name.

##### type ModuleState

```ts
type ModuleState<S extends State> = {
  name: string
  nodes: NodeStateMap<S>
  defaultState: S
  defaultID?: string | null
}
```

Module state.

##### Primitive Thunk Functions

##### `upsert(idOrData, data?)`

```ts
const upsert = <S extends State>(
  idOrData: Partial<S> | string | null | undefined,
  data?: Partial<S>,
): Thunk<S>
```

* `upsert(data)` (`id` as `defaultID`)
* `upsert(id, data)`

Update the data. Create the state in moduleState first if state is not in moduleState.


##### `update(idOrData, data?)`

```ts
const update = <S extends State>(
  idOrData: Partial<S> | string | null | undefined,
  data?: Partial<S>,
): Thunk<S>
```

* `update(data)` (`id` as `defaultID`)
* `update(id, data)`

Update the data. No update if `id` or `data` is invalid.

##### `remove(id?)`

```ts
const remove = <S extends State>(id?: string | null): Thunk<S>
```

Remove the state. defaultID is set as null if id is defaultID.

##### `init(idOrState, state?)`

```ts
const init = <S extends State>(
  idOrState: S | string | null | undefined,
  state?: S,
): Thunk<S>
```

Initialize the state. Set id to defaultID if defaultID does not exist.

Most of time we don't need to init because get(id) and useThunk automatically init the state if not exist.

### Advanced Usage

The following APIs are for advanced usage.

#### types

##### `Thunk`

Full definition of `Thunk` is:

```ts
export type Thunk<S extends State> = async (
  set: set<S>,
  get: (id?: string) => S,
  getOrNull: (id?: string) => S | null | undefined,
  dispatch: dispatch<S>,
  getModuleState: () => ModuleState<S>,
) => void
```

* `set`: can be used in the following setting:
    * `set(ThunkFunc())`: calling a thunk function.
    * `set(id, data: Partial<S>)`: upsert state of `id` (syntax sugar of `set(upsert(id, data))`).
* `get(id?)`: (Guaranteed) get the state of `id` (or `defaultID` if `id` is not present).
* `getOrNull(id?)`: get the state of `id`. Get the state of `defaultID` if `id` is not present. Return `null` if `id` or state is not available.
* `dispatch`: `dispatch(ThunkFunc())` (calling a thunk function).
* `getModuleState`: get the module state.

##### `UseThunk`

```ts
export type UseThunk<S extends State, T extends ThunkModule<S>> = [
  Readonly<ModuleState<S>>,
  doModule<S, toThunkFuncMap<T>>,
]
```

#### Primitive Thunk Functions.

##### setDefaultID

```ts
const setDefaultID = (id: string): BaseAction
```

Set default id.

#### useThunkModuleState

##### `useThunkModuleState(theDo: ThunkModule): [moduleState, doModule]`

```ts
const useThunkModuleState = <S extends State, T extends ThunkModule<S>>(module: T) => [Readonly<ModuleState<S>, doModule<S, toThunkFuncMap<T>>]
```

Get the moduleState and doModule.

return: `[moduleState, doModule]`.

##### `type UseThunkModuleState`

```ts
export type UseThunkModuleState<S extends State, T extends ThunkModule<S>> = [
  Readonly<ModuleState<S>>,
  toDoModule<S, T>,
]
```

Type of useThunkModuleState.


#### Module State Related.

##### `getStateOrNullByModule(moduleState: ModuleState, id?: string): State | null`

```ts
const getStateOrNullByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
): Readonly<S | null>
```

Get the state from module state. Return `null` if the state does not exist.

##### `getNodeOrNullByModule(moduleState: ModuleState, id?: string): NodeState | null`

```ts
const getNodeOrNullByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
): Readonly<NodeState<S> | null>
```

Get the node from module state. Return `null` if the node does not exist.

##### `getDefaultID(modulestate: ModuleState)`

```ts
const getDefaultID = <S extends State>(moduleState: ModuleState<S>): string | null | undefined
```

Get defaultID.

#### Misc

##### `genID(): string`

Generate `id` for the state.
