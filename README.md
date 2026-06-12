# use-thunk

[![codecov](https://codecov.io/gh/chhsiao1981/use-thunk/branch/main/graph/badge.svg)](https://codecov.io/gh/chhsiao1981/use-thunk)

A framework for easily managing global data state with `useThunk`, with [`zustand`](https://github.com/pmndrs/zustand)-like taste.

Inspired by the concepts of [Redux Thunk](https://redux.js.org/usage/writing-logic-thunks) and [Redux Duck](https://github.com/PlatziDev/redux-duck).

[src/useThunkReducer.ts](src/useThunkReducer.ts) is adapted from [nathanbuchar/react-hook-thunk-reducer](https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js).

For more information, please check [docs/00-introduction.md](docs/00-introduction.md).

For usage examples, please refer to [demo-use-thunk](https://github.com/chhsiao1981/demo-use-thunk).

## Install

    npm install --save @chhsiao1981/use-thunk

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

## Introduction



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

## Normalized State

The general concept of normalized state can be found in [Normalizing State Shape](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape)
with the following features:

1. ClassState: the state of the class, including the nodes and the defaultID of the class.
2. NodeState: the state of a node, including the id of the node and the content (state) of the node.
3. State: the content of the node, represented as a state.

For example, the example [in the redux link](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape) is represented as:

```ts
moduleStatePost = {
  name: 'post',
  nodes: {
    [uuid-post1] : {
      id: uuid-post1,
      state: {
        author : uuid-user1,
        body : "......",
        comments: [uuid-comment1, uuid-comment2]
      },
    },
    [uuid-post2] : {
      id : uuid-post2,
      state: {
        author : uuid-user2,
        body : "......",
        comments: [uuid-comment3, uuid-comment4, uuid-comment5]
      }
    }
  },
  defaultID,s
  defaultState,
}
```

and:

```ts
moduleStateComment = {
  myClass: 'module',
  nodes: {
    [uuid-comment1] : {
      id: uuid-comment1,
      state: {
        author : uuid-user2,
        comment : ".....",
      }
    },
    [uuid-comment2] : {
      id : uuid-comment2,
      state: {
        author : uuid-user3,
        comment : ".....",
      }
    },
    [uuid-comment3] : {
      id : uuid-comment3,
      state: {
        author : uuid-user3,
        comment : ".....",
      }
    },
    [uuid-comment4] : {
      id : uuid-comment4,
      state: {
        author : uuid-user1,
        comment : ".....",
      }
    },
    [uuid-comment5] : {
      id : uuid-comment5,
      state: {
        author : uuid-user3,
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
    [uuid-user1] : {
      id: uuid-user1,
      state: {
        username : "user1",
        name : "User 1",
      }
    },
    [uuid-user2] : {
      id: uuid-user2,
      state: {
        username : "user2",
        name : "User 2",
      }
    },
    [uuid-user3] : {
      id: uuid-user3,
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

##### `type Thunk`

`Thunk` is defined as:

```ts
export type Thunk<S extends State> = (
  set: set<S>,
  get: (id?: string) => S,
  getOrNull: (id?: string) => S | null | undefined,
  dispatch: dispatch<S>,
  getModuleState: () => ModuleState<S>,
) => void
```

We generally use only `set` and `get`.

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

##### `doModule<S extends State>`

```ts
export interface doModule<S extends State> {
  [action: string]: ThunkFunc<S>
}
```

##### `ThunkFunc<S extends State>`

```ts
export type ThunkFunc<S extends State> = (...params: any[]) => Thunk<S>
```

#### RegisterThunk / ThunkContext / useThunk

##### `registerThunk(module: ThunkModule)`

register a thunk module.

##### `<ThunkContext>{children}</ThunkContext>`

Rendering thunk context.

##### `useThunk(theDo: ThunkModule): UseThunk`

Similar to `React.useReducer`, but we use `useThunk`, and we also bind the actions with `set` (similar concept as `mapDispatchToProps`).

return: `UseThunk`

#### State

##### `getState(theUseThunk: UseThunk, myID?: string): [state, doModule, theID]`

Get the state of `myID` by `UseThunk`. Get the state of `defaultID` if `myID` is not present. Return `defaultState` if not available.

return: `[state, doModule, theID]`
o
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

#### Default Thunk Functions.

##### `init({myID, parentID, doParent, state})`

initialize the state.

##### `update(myID, data)`

update the data to myID.

##### `upsert(myID, data)`

initialize the state if it does not exist, and update the data to myID.

##### `remove(myID)`

remove the state.

#### State

##### `getStateOrNullByModule(moduleState: ModuleState, myID?: string): state | null`

Get the state of `myID`. Get the state of `defaultID` if `myID` is not present. Return `null` if not available.

##### `getStateByModule(moduleState: ModuleState, myID?: string): state`

Get the state of `myID`. Get the state of `defaultID` if `myID` is not present. Return `defaultState` if not available.

#### Misc

##### `genID(): string`

generate id for the state.

