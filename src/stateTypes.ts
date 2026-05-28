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

// ClassState
export type ClassState<S extends State> = {
  myClass: string
  defaultID?: string | null
  nodes: NodeStateMap<S>
  defaultState: S
}
