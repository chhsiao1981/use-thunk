# [APIs](https://github.com/chhsiao1981/use-thunk/blob/main/src/index.ts)

We mostly need only the following APIs:

## Types

### `State`

```ts
export interface State {
  [key: string]: unknown
}
```

`State` is the most fundamental type for the states in `ThunkModule`s.

### `ThunkModule<S extends State>`

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

### `ThunkFunc<S extends State>`

```ts
export type ThunkFunc<S extends State> = (...params: any[]) => Thunk<S>
```

A thunk function in a thunk module. Thunk function is a function returning thunk.

### `Thunk`

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
* `get(id?: string | null | undefined)`: (Guaranteed) get the state of `id` (or ensured `defaultID` if `id` is not present).

Full definition of `Thunk` is in the [Advanced Usage](#advanced-usage) section.

## RegisterThunk / useThunk

### `registerThunk(module: ThunkModule)`

```ts
const registerThunk = <S extends State>(module: ThunkModule<S>) => void
```
Register a thunk module.

### `useThunk(theDo: ThunkModule)`

```ts
const useThunk = <S extends State, T extends ThunkModule<S>>(module: T, id?: string) => [state: Readonly<S>, doModule: toDoModule<S, T>, string]
```

Get the state of the id, doModule, and the id.

return: `[state, doModule, id]`.

## Module Related

### doMod

```ts
const doMod = <S extends State, T extends ThunkModule<S>>(moduleName: string): doModule<S, T>
```

Get the doModule (module operators/functions) by module name.

### getMod

```ts
const getMod = <S extends State>(moduleName: string): Readonly<ModuleState<S>>
```

Get the module state by module name.

### type doModule

```ts
type doModule<S extends State, T extends ThunkModule<S>> = {
  // @ts-expect-error toThunkFuncMap includes only ThunkFunc<S> | BaseActionFunc
  [action in keyof toThunkFuncMap<T>]: VoidReturnType<toThunkFuncMap<T>[action]>
} & Omit<defaultDoModule, keyof toThunkFuncMap<T>>
```

Functions in `doModule` already wrap thunk functions with set (`dispatch` in `Redux` / `useReducer`). `doModule` functions can be directly used. We don't wrap `doModule` functions with `set`/`dispatch`.

### type ModuleState

```ts
type ModuleState<S extends State> = {
  name: string
  nodes: NodeStateMap<S>
  defaultState: S
  defaultID?: string | null
}
```

Module state.

## Primitive Thunk Functions

### `upsert(idOrData, data?)`

```ts
const upsert = <S extends State>(
  idOrData: Partial<S> | string | null | undefined,
  data?: Partial<S>,
): Thunk<S>
```

Update the data. Create the state in moduleState first if state is not in moduleState.

Can be used as:

* `upsert(id, data)`
* `upsert(data)` (`id` as `defaultID`)

### `update(idOrData, data?)`

```ts
const update = <S extends State>(
  idOrData: Partial<S> | string | null | undefined,
  data?: Partial<S>,
): Thunk<S>
```

Update the data. No update if `id` or `data` is invalid.

Can be used as:

* `update(id, data)`
* `update(data)` (`id` as `defaultID`)

### `remove(id?)`

```ts
const remove = <S extends State>(id?: string | null): Thunk<S>
```

Remove the state. defaultID is set as null if id is defaultID.

### `init(idOrState, state?)`

```ts
const init = <S extends State>(
  idOrState: S | string | null | undefined,
  state?: S,
): Thunk<S>
```

Initialize the state.

Most of time we don't need to init because `upsert`, `set(id, data)`, `get(id)` and `useThunk` automatically initialize the state if not exist.

## Misc

### `genID(): string`

Generate `id` for the state.

## Advanced Usage

The following APIs are for advanced usage.

### types

#### `Thunk`

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
* `get(id?)`: (Guaranteed) get the state of `id` (or ensured `defaultID` if `id` is not present).
* `getOrNull(id?)`: get the state of `id`. Get the state of `defaultID` if `id` is not present. Return `null` if `id` or state is not available.
* `dispatch`: `dispatch(ThunkFunc())` (calling a thunk function).
* `getModuleState`: get the module state.

#### `UseThunk`

```ts
type UseThunk<S extends State, T extends ThunkModule<S>> = [Readonly<S>, toDoModule<S, T>, string]
```

### Module State Related.

Module-state-related functions are used only within thunks or event-handles and effect hooks. Use `useThunk` outside of event handlers and effect hooks.

#### `getStateByModule(moduleState: ModuleState, id? string)`

```ts
const getStateByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
): Readonly<S>
```
Get the state from module state. `id` as ensured `defaultID` if `id` is not present.

#### `getStateOrNullByModule(moduleState: ModuleState, id?: string): State | null`

```ts
const getStateOrNullByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
): Readonly<S | null>
```

Get the state from module state. Return `null` if the state does not exist.

#### `getNodeOrNullByModule(moduleState: ModuleState, id?: string): NodeState | null`

```ts
const getNodeOrNullByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
): Readonly<NodeState<S> | null>
```

Get the node from module state. Return `null` if the node does not exist.
