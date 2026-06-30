import type { RefObject } from 'react'

/**
 * the most fundamental state.
 *
 * interface State {[key: string]: unknown}
 */
export interface State {
  [key: string]: unknown
}

// NodeState
export type NodeState<S extends State> = {
  id: string
  state: S
}

/**
 * module state
 */
export type ModuleState<S extends State> = {
  name: string
  nodes: NodeStateMap<S>
  defaultState: S
  defaultID?: string | null
}

export type NodeStateMap<S extends State> = {
  [key: string]: NodeState<S>
}

export type RefModuleState<S extends State> = RefObject<ModuleState<S>>
