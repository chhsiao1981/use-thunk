export enum StateType {
  SHARED = 'shared',
  LOCAL = 'local',
}

export enum Relation {
  CHILDREN = '_children',
  LINKS = '_links',
}

export const PARENT = '_parent'

//State
export interface State {
  [key: string]: unknown
}

// NodeState
export type NodeState<S extends State> = {
  id: string
  state: S
  [Relation.CHILDREN]?: NodeStateRelation | null
  [PARENT]?: NodeMeta | null
  [Relation.LINKS]?: NodeStateRelation | null
}

// NodeStateRelation
type NodeStateRelation = {
  [relationClass: string]: {
    list: string[]
    // @ts-expect-error do can be any type.
    do: DispatchFuncMap
  }
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
  root?: string | null
  // XXX doMe is a hidden variable for ClassState
  //     used only for parents / children / links.
  // doMe: DispatchFuncMap
  nodes: NodeStateMap<S>
}

// Node
export type NodeMeta = {
  id: string
  theClass: string
  // @ts-expect-error do can be any type.
  do: DispatchFuncMap
}
