import type { ClassState, State } from './stateTypes'
import type { ActionOrThunk as rActionOrThunk, Thunk as rThunk } from './useThunkReducer'

// BaseAction contains only object-based actions, no thunk-based actions.
export interface BaseAction {
  myID: string
  type: string
  [key: string]: unknown
}
// Thunk
export type Thunk<S extends State> = rThunk<S, BaseAction>

export type ActionOrThunk<S extends State> = rActionOrThunk<S, BaseAction>

// ActionFunc
// biome-ignore lint/suspicious/noExplicitAny: unknown requires same type in list. use any for possible different types.
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>

// GetClassState
export type GetClassState<S extends State> = () => ClassState<S>
