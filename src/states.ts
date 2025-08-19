import type { ClassState, NodeState, State } from './stateTypes'

export const getRootNode = <S extends State>(state: ClassState<S>): NodeState<S> | null => {
  const root = state.root
  if (!root) {
    return null
  }
  return state.nodes[root] || null
}

export const getRootID = <S extends State>(state: ClassState<S>): string => {
  return state.root ?? ''
}

export const getRoot = <S extends State>(state: ClassState<S>): S | null => {
  const root = state.root
  if (!root) {
    return null
  }
  const me = state.nodes[root]
  if (!me) {
    return null
  }
  return me.state
}

export const getNode = <S extends State>(state: ClassState<S>, myID?: string): NodeState<S> | null => {
  if (!myID) {
    return getRootNode(state)
  }

  return state.nodes[myID] || null
}

export const getState = <S extends State>(state: ClassState<S>, myID?: string): S | null => {
  if (!myID) {
    return getRoot(state)
  }

  const me = state.nodes[myID]
  if (!me) {
    return null
  }
  return me.state
}
