import type { ClassState, State } from '../stateTypes'
import type { ActionOrThunk } from './ActionOrThunk'
import type BaseAction from './baseAction'
import type { Thunk } from './thunk'

export type { Thunk, ActionOrThunk, BaseAction }

// ActionFunc
// biome-ignore lint/suspicious/noExplicitAny: params can be any type.
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>

// biome-ignore lint/suspicious/noExplicitAny: params can by any type.
export type ThunkFunc<S extends State> = (...params: any[]) => Thunk<S>

// GetClassState
export type GetClassState<S extends State> = () => ClassState<S>
