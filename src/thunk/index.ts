import type { State } from '../states'
import type { dispatch } from './dispatch'
import type { get } from './get'
import type { getModuleState } from './getModuleState'
import type { getOrNull } from './getOrNull'
import type { set } from './set'

export type { set, get, getOrNull, dispatch, getModuleState }

// Thunk
export type Thunk<S extends State> = (
  set: set<S>,
  get: get<S>,
  getOrNull: getOrNull<S>,
  dispatch: dispatch<S>,
  getModuleState: getModuleState<S>,
) => void

// biome-ignore lint/suspicious/noExplicitAny: params can be any type.
export type ThunkFunc<S extends State> = (...params: any[]) => Thunk<S>
