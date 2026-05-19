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

export type NodeStateMapByClass<S extends State> = {
  [className: string]: NodeStateMap<S>
}

// ClassState
export type ClassState<S extends State> = {
  myClass: string
  defaultID?: string | null
  nodes: NodeStateMap<S>
  defaultState: S
}

// Node
export type NodeMeta = {
  id: string
  theClass: string
  // @ts-expect-error do can be any type.
  do: DispatchFuncMap
}
