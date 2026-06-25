import type { State } from '../states'
import type { Thunk } from '../thunk'
import type BaseAction from './baseAction'

export type ActionOrThunk<S extends State> = BaseAction | Thunk<S>
