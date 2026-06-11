//State
export interface State {
  [key: string]: unknown
}

// NodeState
export type NodeState<S extends State> = {
  id: string
  state: S
}

export type NodeStateMap<S extends State> = {
  [key: string]: NodeState<S>
}

// ModuleState
export type ModuleState<S extends State> = {
  name: string
  defaultID?: string | null
  nodes: NodeStateMap<S>
  defaultState: S
}
