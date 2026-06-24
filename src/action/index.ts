import type { ModuleState, State } from '../states'
import type { ActionOrThunk } from './ActionOrThunk'
import type BaseAction from './baseAction'
import type { Thunk } from './thunk'

export type { ActionOrThunk, BaseAction, Thunk }

// ActionFunc
// biome-ignore lint/suspicious/noExplicitAny: params can be any type.
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>

// biome-ignore lint/suspicious/noExplicitAny: params can be any type.
export type BaseActionFunc = (...params: any[]) => BaseAction

// biome-ignore lint/suspicious/noExplicitAny: params can be any type.
export type ThunkFunc<S extends State> = (...params: any[]) => Thunk<S>

// getModuleState
export type getModuleState<S extends State> = () => ModuleState<S>
