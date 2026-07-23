# use-thunk

[![codecov](https://codecov.io/gh/chhsiao1981/use-thunk/branch/main/graph/badge.svg)](https://codecov.io/gh/chhsiao1981/use-thunk)

A framework for easily managing global data state with `useThunk`, with [`zustand`](https://github.com/pmndrs/zustand)-like taste. Notably:

* **File-as-a-Module**: Instead of managing a massive, centralized global store configuration, we treat files as independent, isolated domain modules where we implement our thunk functions.
* **Discrete Entity Nodes**: The module manages state as distinct data objects. We can use an optional id parameter to isolate, identify, and operate on specific individual data nodes cleanly.
* **Clean Component Interface**: Components stay completely decoupled from state internals. They simply invoke the module's functions to trigger updates.
* **No Need `<Provider />`**: Say goodbye to "Provider Hell." Similar to zustand, use-thunk removes the need for a wrapper Provider entirely. Unlike standard `useContext` or complex Redux setups, we get a clean component tree with no stacked providers and zero layout headaches.

Inspired by the concepts of [Redux Thunk](https://redux.js.org/usage/writing-logic-thunks) and [Redux Duck](https://github.com/PlatziDev/redux-duck).

For usage examples, please refer to [demo-use-thunk (async counter)](https://github.com/chhsiao1981/demo-use-thunk) and [demo-use-thunk-tic-tac-toe](https://github.com/chhsiao1981/demo-use-thunk-tic-tac-toe).

Learn more from [https://chhsiao1981.github.io/use-thunk/](https://chhsiao1981.github.io/use-thunk/).

## Acknowledgement

* [useThunkReducer.ts](src/useThunk/useThunkReducer.ts) is adapted from [nathanbuchar/react-hook-thunk-reducer](https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js). Copyright (c) 2019 Nathan Buchar <hello@nathanbuchar.com> under MIT License.
* 16.0.0 is based on the comments from [reddit discussion](https://www.reddit.com/r/reactjs/comments/1ufttri/usethunk_a_much_simplified_globalstatemanagement/). I thank [Obvious-Monitor8510](https://www.reddit.com/user/Obvious-Monitor8510/), [WanderWatterson](https://www.reddit.com/user/WanderWatterson/), [Honey-Entire](https://www.reddit.com/user/Honey-Entire/), and [OxidalWave](https://www.reddit.com/user/OxidalWave/) for their valuable feedback.
* 16.1.0 (object-based re-rendering through [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)) is based on [Obvious-Monitor8510](https://www.reddit.com/user/Obvious-Monitor8510/)'s comment from [reddit discussion](https://www.reddit.com/r/reactjs/comments/1ufttri/comment/otvihwk/).
* Thanks to [@strass](https://github.com/strass), starting 16.1.2, the npm package is named `use-thunk`.

## Breaking Changes

* Starting 16.1.2, the npm package is named `use-thunk`.
* Starting 16.1.0, we no longer need `<ThunkContext />`.

## Install

    npm install use-thunk

## Getting Started

### `id`-based Usage
A complete example to do increment:

```ts
// thunks/increment.ts
import { type Thunk, type State as _State, update } from 'use-thunk'

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
import { useThunk, getState } from 'use-thunk'
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
import { registerThunk } from "use-thunk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as ModIncrement from './thunks/increment'
import App from "./components/App";

registerThunk(ModIncrement)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### `id`-less Usage
The `id` can be omitted if we have only 1 data-obj in the thunk module.
For example, the previous increment example can be simplified as follow:

```ts
// thunks/increment.ts
import { type Thunk, type State as _State, update } from 'use-thunk'

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
import { useThunk, getState } from 'use-thunk'
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
import { registerThunk } from "use-thunk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as ModIncrement from './thunks/increment'
import App from "./components/App";

registerThunk(ModIncrement)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## Development Pattern

### Must Included in a Thunk Module

```ts
import type { State as _State } from 'use-thunk'

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
import { useThunk, getState } from 'use-thunk'
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
import { registerThunk } from 'use-thunk'
import * as ModModule from '../thunks/module'
registerThunk(ModModule)
.
.
.

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Learn more from [https://chhsiao1981.github.io/use-thunk/](https://chhsiao1981.github.io/use-thunk/).
