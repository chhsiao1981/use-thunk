import type { ClassState, NodeState, State } from './stateTypes'

const getRootNode = <S extends State>(classState: ClassState<S>): NodeState<S> | null => {
  const root = classState.root
  if (!root) {
    return null
  }
  return classState.nodes[root] || null
}

export const getRootID = <S extends State>(classState: ClassState<S>): string => {
  return classState.root ?? ''
}

const getRoot = <S extends State>(classState: ClassState<S>): S | null => {
  const root = classState.root
  if (!root) {
    return null
  }
  const me = classState.nodes[root]
  if (!me) {
    return null
  }
  return me.state
}

export const getNode = <S extends State>(
  classState: ClassState<S>,
  myID?: string,
): NodeState<S> | null => {
  if (!myID) {
    return getRootNode(classState)
  }

  return classState.nodes[myID] || null
}

export const getState = <S extends State>(classState: ClassState<S>, myID?: string): S | null => {
  if (!myID) {
    return getRoot(classState)
  }

  const me = classState.nodes[myID]
  if (!me) {
    return null
  }
  return me.state
}
