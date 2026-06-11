# use-thunk

[![codecov](https://codecov.io/gh/chhsiao1981/use-thunk/branch/main/graph/badge.svg)](https://codecov.io/gh/chhsiao1981/use-thunk)

A framework easily using `useThunk` to manage the data-state.

Adopted concept of [redux-thunk](https://redux.js.org/usage/writing-logic-thunks) and [redux-duck](https://github.com/PlatziDev/redux-duck)

[src/useThunkReducer.ts](src/useThunkReducer.ts) is adopted from [nathanbuchar/react-hook-thunk-reducer](https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js).

`use-thunk` is with the following additional features:

1. The development of the thunk modules follows the concept of `redux-duck`.
2. Instead of action / reducer, we focus only on `thunk`, and have the primitive actions/reducers.

Please check [docs/00-introduction.md](docs/00-introduction.md) for more information.

Please check [demo-use-thunk](https://github.com/chhsiao1981/demo-use-thunk) for a demo to use Thunk.

### Breaking Changes

* Starting from [`12.0.0`](https://github.com/chhsiao1981/use-thunk/releases/tag/12.0.0): redefining the `getState` functions.
    1. `getState` => `getStateOrNullByModule`, `mustGetState` => `getStateByModule`.
    2. `mustGetStateByThunk` => `getState`.
* Starting from [`11.0.0`](https://github.com/chhsiao1981/use-thunk/releases/tag/11.0.0):
    1. `setData` => `update`, `registerThunk` => `createThunk`, `dispatch` => `set`, `ClassState` => `ModuleState`, and `ModuleState.myClass` => `ModuleState.name`.
    2. `Thunk` is `(set, get, getModuleState) => {}`, where `get(id)` directly returns object-level state.
* Starting from [`10.0.0`](https://github.com/chhsiao1981/use-thunk/releases/tag/10.0.0): The ClassState is shared globally, with `registerThunk` and `ThunkContext`.
* Starting from [`9.0.0`](https://github.com/chhsiao1981/use-thunk/releases/tag/9.0.0): npm package is renamed as [@chhsiao1981/use-thunk](https://www.npmjs.com/package/%40chhsiao1981/use-thunk)
* Starting from [`8.0.0`](https://github.com/chhsiao1981/use-thunk/releases/tag/8.0.0): [Totally renamed as `useThunk`](https://github.com/chhsiao1981/use-thunk/issues/105).

## Install

    npm install --save @chhsiao1981/use-thunk

## Example

Thunk module able to do increment (reducers/increment.ts):

```ts
import { init as _init, update, Thunk, type State as rState, genUUID } from '@chhsiao1981/use-thunk'

export const name = 'demo/Increment'

export interface State extends rState {
  count: number
}

export const defaultState: State = {
  count: 0
}

export const init = (): Thunk<State> => {
  const myID = genUUID()
  return async (set) => {
    set(_init({myID, state: defaultState}))
  }
}

export const increment = (myID: string): Thunk<State> => {
  return async (set, get) => {
    let me = get(myID)
    if(!me) {
      return
    }
    const {count} = me

    set(update(myID, { count: count + 1 }))
  }
}
```

App.tsx:

```tsx
import { type ThunkModuleToFunc, useThunk, getState } from '@chhsiao1981/use-thunk'
import * as DoIncrement from './reducers/increment'

type TDoIncrement = ThunkModuleToFunc(typeof DoIncrement)

type Props = {
}

export default (props: Props) => {
  const useIncrement = useThunk<DoIncrement.State, TDoIncrement>(DoIncrement, StateType.LOCAL)
  const [increment, doIncrement, incrementID] = getState(useIncrement)

  //init
  useEffect(() => {
    doIncrement.init()
  }, [])

  // to render
  return (
    <div>
      <p>count: {increment.count}</p>
      <button onClick={() => doIncrement.increment(incrementID)}>increase</button>
    </div>
  )
}
```

main.tsx:
```tsx
import { createThunk, ThunkContext } from "@chhsiao1981/use-thunk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as DoIncrement from './reducers/increment'
import App from "./App.tsx";

createThunk(DoIncrement)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThunkContext>
      <App />
    </ThunkContext>
  </StrictMode>,
)
```

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

### Must Included in a Top-level Component

```ts
import { type ThunkModuleToFunc, useThunk, getState } from '@chhsiao1981/use-thunk'
import * as DoModule from '../reducers/module'

type TDoModule = ThunkModuleToFunc<typeof DoModule>

const Component = () => {
  const useModule = useThunk<DoModule.State, TDoModule>(DoModule)
  const [module, doModule, moduleID] = getState(useModule)

.
  .
  .
}
```

### Must Included in main.tsx

```tsx
import { createThunk, ThunkContext } from '@chhsiao1981/use-thunk'
createThunk(...)
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

### Basic

##### `createThunk(theModule: ThunkModule)`

Create a module state for `theModule`.

##### `<ThunkContext>{children}</ThunkContext>`

Rendering Thunk context.

##### `useThunk(theDo: ThunkModule): UseThunk`

Similar to `React.useReducer`, but we use `useThunk`, and we also bind the actions with set (similar concept as `mapDispatchToProps`).

return: `UseThunk`

### Default Thunk functions.

##### `init({myID, parentID, doParent, state}, myuuidv4?)`

initializing the state.

##### `update(myID, data)`

update the data to myID.

##### `remove(myID)`

remove the state.

##### `genUUID(myuuidv4?: () => string): string`

generate uuid for the state.

### State

##### `getState(theUseThunk: UseThunk, myID?: string): [state, doModule, theID]`

Get the state of `myID` by `UseThunk`. Get the state of `defaultID` if `myID` is not present. Return `defaultState` if not available.

return: `[state, doModule, theID]`

##### `getStateOrNullByModule(moduleState: ModuleState, myID?: string): state | null`

Get the state of `myID`. Get the state of `defaultID` if `myID` is not present. Return `null` if not available.

##### `getStateByModule(moduleState: ModuleState, myID?: string): state`

Get the state of `myID`. Get the state of `defaultID` if `myID` is not present. Return `defaultState` if not available.
