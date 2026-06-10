import type { Dispatch } from 'react'
// XXX requiring to import directly from action/ActionOrThunk, or it will cause looping.
import type { ActionOrThunk } from './action/ActionOrThunk'
import type { State } from './stateTypes'

// set
export type set<S extends State> = Dispatch<ActionOrThunk<S>>
