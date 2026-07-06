# Comparison

The following table is the comparison based on my knowledge:

\* not familiar with zustand and SSR.

| Items | use-thunk | React Redux | *zustand | useContext |
|-------|-----------|-------------|---------|------------|
| requiring single-store concept (can have only 1 create function) | no | yes | yes | no |
| modularized programming style | natively built | through `createSlice` | [through slice pattern](https://zustand.docs.pmnd.rs/learn/guides/slices-pattern) | not specified
| objects-of-the-same-module | natively built | no | no | no |
| get state | directly from `get` or `useThunk` as a `js`/ `ts` object | through selectors | through selectors | directly from context value |
| state operations | directly from module functions | through action / reducer | through selectors as functions | `setValue` in `{value, setValue}` pattern |
| async functions | within thunk functions | within thunk functions | within functions | not specified |
| requiring provider | no | yes | no | yes |
| cross-module communication | through `doMod` / `getMod` | through `dispatch(action)` | through [creating new slice](https://zustand.docs.pmnd.rs/learn/guides/slices-pattern) | through `setValue` in `{value, setValue}` pattern |
| knowledge requirement | registerThunk / useThunk / thunk / thunk-module / primitive thunk functions | (a lot) | create / slice pattern / selector | createContext / `<Context />` / useContext / `{value, setValue}` pattern |
| *server-side rendering (SSR) support | (not tested) | [yes](https://redux.js.org/usage/server-rendering) | [yes](https://zustand.docs.pmnd.rs/learn/guides/nextjs) | yes |
| suitable usage | all kinds of ReactJS apps, especially complex apps (ex: dashboard) | all kinds of ReactJS apps | all kinds of ReactJS apps | simple ReactJS apps unless heavily customized |
