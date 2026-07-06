# FAQ

## Is It Another Redux Clone?

It's not a Redux clone: Despite the name, this isn't a Redux clone—the underlying implementation is built on top of `useSyncExternalStore`. In addition:

* Boilerplate Reduction: The entire goal of this project is to provide an easy-to-maintain architectural style with as little boilerplate and repetitive code as possible.
* File-as-a-Module Architecture: Inspired by languages like Go and Python, I strongly believe that treating files/folders as self-contained domain modules makes complex apps (like massive data dashboards) vastly easier to maintain.
* Single Source of Truth: Even though the developer experience feels heavily modularized, everything resolves into a single source of truth under the hood. We can think of these "modules" like Redux "slices," but use-thunk completely handles the heavy lifting of mapping those slices to a single store for us.

## Since It is Not Redux, Why is It Named use-thunk?

1. The programming pattern is based on [thunk](https://redux.js.org/usage/writing-logic-thunks).
2. The library actually originated from [github://nathanbuchar/react-hook-thunk-reducer](https://github.com/nathanbuchar/react-hook-thunk-reducer/blob/master/src/thunk-reducer.js), which is why "thunk" is in the name. I used it heavily in internal projects but struggled for a long time to find the right API naming. Recently, after seeing how intuitive zustand made things with set/get (as opposed to dispatch/getState), and combining that with the amazing feedback from r/reactjs on Reddit, I finally feel like the API is polished, clean, and ready for the public.

## What If I Use A Module In Both `id`-based and `id`-less？

For the `id`-less object, we use genID (crypto.randomUUID) to generate an id for the `id`-less object. It is expected that the `id`-based objects and the `id`-less object would not interfere with each other.

Therefore:

1. It is expected that `obj0 !== objDefault`.
```ts
const [obj0] = useThunk<MoModule.State, typeof ModModule>(id0)
const [objDefault] = useThunk<MoModule.State, typeof ModModule>()

```


2. It is expected that the following `useEffect` updates no entity and considered bad programming style.
```ts
const [obj0] = useThunk<MoModule.State, typeof ModModule>(id0)

useEffect(() => {
    doModule.update({'test': 'test1'})
}, [])
```

3. example 2 can be re-written as:
```ts
const [obj0] = useThunk<MoModule.State, typeof ModModule>()

useEffect(() => {
    doModule.update({'test': 'test1'})
}, [])
```

4. example 2 can be re-written as (2):
```ts
const [obj0, _, id0] = useThunk<MoModule.State, typeof ModModule>()

useEffect(() => {
    doModule.update(id0, {'test': 'test1'})
}, [])
```

5. example 2 can be re-written as (3):
```ts
const id0 = genID()
const [obj0] = useThunk<MoModule.State, typeof ModModule>(id0)

useEffect(() => {
    doModule.update(id0, {'test': 'test1'})
}, [])
```
