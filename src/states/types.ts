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

// ModuleState
export type ModuleState<S extends State> = {
  name: string
  nodes: NodeStateMap<S>
  defaultState: S
  defaultID?: string | null
}

export type NodeStateMap<S extends State> = {
  [key: string]: NodeState<S>
}
