import type { RefObject } from 'react'

/**
 * the most fundamental state.
 *
 * interface State {[key: string]: unknown}
 */
export interface State {
  [key: string]: unknown
}

export type StateAndDefaultState<S extends State> = {
  state: S
  defaultState: S | null
}

export type Listener = () => void

// NodeState
export type NodeState<S extends State> = {
  id: string
  stateAndDefaultState: StateAndDefaultState<S>
}

export type SubscribeState<S extends State> = {
  listeners: Listener[]
  subscribe: (listener: Listener) => () => void
  getSnapshot: () => StateAndDefaultState<S>
  emitChange: (listeners: Listener[]) => void
}

/**
 * module state
 *
 * @param name module name
 * @param nodes nodes in the module
 * @param subscribes of the nodes.
 * @param defaultState initialized state if not presented.
 * @param defaultID defaultID of the module, mostly for id-less module.
 * @param isIDBased is id-based module. for performance gain by not checking default-id in disptch.
 */
export type ModuleState<S extends State> = {
  name: string
  nodes: NodeStateMap<S>
  subscribes: SubscribeStateMap<S>
  defaultState: S
  defaultID?: string | null
  isIDBased: boolean
}

export type NodeStateMap<S extends State> = {
  [key: string]: NodeState<S>
}

export type SubscribeStateMap<S extends State> = {
  [key: string]: SubscribeState<S>
}

export type RefModuleState<S extends State> = RefObject<ModuleState<S>>
