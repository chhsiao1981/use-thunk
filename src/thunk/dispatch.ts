import type { Dispatch } from 'react'
// XXX requiring to import directly from action/ActionOrThunk, or it will cause looping.
import type { ActionOrThunk } from '../action/ActionOrThunk'
import type { State } from '../states'

/**
 * the original dispatch dealing with base-action or thunk.
 */
export type dispatch<S extends State> = Dispatch<ActionOrThunk<S>>
