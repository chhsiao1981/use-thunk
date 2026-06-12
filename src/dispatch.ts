import type { Dispatch } from 'react'
// XXX requiring to import directly from action/ActionOrThunk, or it will cause looping.
import type { ActionOrThunk } from './action'
import type { State } from './states'

// dispatch
export type dispatch<S extends State> = Dispatch<ActionOrThunk<S>>
