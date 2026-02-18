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

* Starting from `10.0.0`: The ClassState is shared globally, with `registerThunk` and `ThunkContext`.
* Starting from `9.0.0`: npm package is renamed as [@chhsiao1981/use-thunk](https://www.npmjs.com/package/%40chhsiao1981/use-thunk)
* Starting from `8.0.0`: [Totally renamed as `useThunk`](https://github.com/chhsiao1981/use-thunk/issues/105).

## Install

    npm install --save @chhsiao1981/use-thunk

## Example

Thunk module able to do increment (reducers/increment.ts):

```ts
import { init as _init, setData, Thunk, getState, type State as rState, genUUID } from '@chhsiao1981/use-thunk'

export const myClass = 'demo/Increment'

export interface State extends rState {
  count: number
}

export const defaultState: State = {
  count: 0
}

export const init = (): Thunk<State> => {
  const myID = genUUID()
  return async (dispatch, getClassState) => {
    dispatch(_init({myID, state: defaultState}))
  }
}

export const increment = (myID: string): Thunk<State> => {
  return async (dispatch, getClassState) => {
    let classState = getClassState()
    let me = getState(classState, myID)
    if(!me) {
      return
    }

    dispatch(setData(myID, { count: me.count + 1 }))
  }
}
```

App.tsx:

```tsx
import { type ThunkModuleToFunc, useThunk, getDefaultID, getState } from '@chhsiao1981/use-thunk'
import * as DoIncrement from './reducers/increment'

type TDoIncrement = ThunkModuleToFunc(typeof DoIncrement)

type Props = {
}

export default (props: Props) => {
  const [classStateIncrement, doIncrement] = useThunk<DoIncrement.State, TDoIncrement>(DoIncrement, StateType.LOCAL)

  //init
  useEffect(() => {
    doIncrement.init()
  }, [])

  // states
  const incrementID = getDefaultID(classStateIncrement)
  const increment = getState(classStateIncrement) || DoIncrement.defaultState

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
import { registerThunk, ThunkContext } from "@chhsiao1981/use-thunk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as DoIncrement from './reducers/increment'
import App from "./App.tsx";

registerThunk(DoIncrement)

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

// reducer class name.
export const myClass = ""

// state definition of the reducer.
export interface State extends rState {
}

.
.
.
```

### Must Included in a Top-level Component

```ts
import { type ThunkModuleToFunc, useThunk, getDefaultID, getState } from '@chhsiao1981/use-thunk'
import * as DoModule from '../reducers/module'

type TDoModule = ThunkModuleToFunc<typeof DoModule>

const Component = () => {
  const [stateModule, doModule] = useThunk<DoModule.State, TDoModule>(DoModule)

  const moduleID = getDefaultID(stateModule)
  const theModule = getState(stateModule)

  .
  .
  .
}
```

### Must Included in main.tsx

```tsx
registerThunk(...)
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
classStatePost = {
  myClass: 'post',
  doMe: (DispatchedAction<Post>),
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
  }
}
```

and:

```ts
classStateComment = {
  myClass: 'comment',
  doMe: (DispatchedAction<Comment>),
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
}
```

and:
```ts
classStateUser = {
  myClass: 'user',
  doMe: (DispatchedAction<User>),
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
}
```

## [APIs](https://github.com/chhsiao1981/use-thunk/blob/main/src/index.d.ts)

### Basic

##### `useThunk(theDo: ThunkModuleFunc): [ClassState, DispatchedAction]`

Similar to `React.useReducer`, but we use `useThunk`, and we also bind the actions with dispatch (similar concept as `mapDispatchToProps`).s

return: `[ClassState<S>, DispatchedAction<S>]`

##### `init({myID, parentID, doParent, state}, myuuidv4?)`

initializing the react-object.

##### `setData(myID, data)`

set the data to myID.

##### `remove(myID, isFromParent=false)`

remove the react-object.

##### `genUUID(myuuidv4?: () => string): string`

generate uuid for react-object.

### State

##### `getState(state: ClassState, myID?: string): State`

Get the state of `myID`. Get the state of `defaultID` if `myID` is not present.

##### `getDefaultID(state: ClassState): string`

get the default id.

##### `getRootID(state: ClassState): string`

(to be deprecated in 10.2.0.)
alias of `getDefaultID` for compatibility.

### NodeState

##### `getNode(state: ClassState, myID?: string): NodeState`

Get the node of `myID`. Get the node of `defaultID` if `myID` is not present.
