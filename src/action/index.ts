import type { State } from '../states'
import type { ActionOrThunk } from './ActionOrThunk'
import type BaseAction from './baseAction'

export type { ActionOrThunk, BaseAction }

// ActionFunc
// biome-ignore lint/suspicious/noExplicitAny: params can be any type.
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>

// biome-ignore lint/suspicious/noExplicitAny: params can be any type.
export type BaseActionFunc = (...params: any[]) => BaseAction
