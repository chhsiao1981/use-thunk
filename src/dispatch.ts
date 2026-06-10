import type { Dispatch as rDispatch } from 'react'
// XXX requiring to import directly from action/ActionOrThunk, or it will cause looping.
import type { ActionOrThunk } from './action/ActionOrThunk'
import type { State } from './stateTypes'

// Dispatch
export type Dispatch<S extends State> = rDispatch<ActionOrThunk<S>>
