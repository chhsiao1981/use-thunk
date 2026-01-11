# Globally Shared Thunk

It is with the need that we treat the thunk as global variables that
can be used across components (ex: the same user information used across components).
With static components (the components that are statically pre-defined and able to use react hooks),
we hope that we **at most** specify the id to the children static-components, and the children static-components
can automatically get the info of the thunk based on the id (or inferred from the root-id).

## Considerations
1. In the typical setting, React requires update of props, or update of the hook, to have the component re-rendered.
2. If the hook is only in the parent components, then the child components won't be updated if we pass only the id to the child components.
3. Furthermore, the dispatchMap is triggered based on each component. With current settings, dispatchMap needs to be allocated for each indivual component, even if they are in the same class.
4. It is possible to `useContext` to have the components be updated.
5. For the `useContext`:
    1. We do `registerThunk` for `createContext`.
    2. We do `ThunkContext` for `[Thunk]Providers`.
    3. We do `useThunk` to get the Thunk. `useThunk` wraps `useContext`.
6. Caveats of `useContext`: it's a kind of the react-hooks and can only be used in the static components.
