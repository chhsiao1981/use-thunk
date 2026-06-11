import type { ModuleState, State } from '../stateTypes'
import type { ActionOrThunk } from './ActionOrThunk'
import type BaseAction from './baseAction'
import type { Thunk } from './thunk'

export type { Thunk, ActionOrThunk, BaseAction }

// ActionFunc
// biome-ignore lint/suspicious/noExplicitAny: params can be any type.
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>

// biome-ignore lint/suspicious/noExplicitAny: params can by any type.
export type ThunkFunc<S extends State> = (...params: any[]) => Thunk<S>

// getModuleState
export type getModuleState<S extends State> = () => ModuleState<S>
