import type { ClassState, NodeState, State } from './stateTypes'

export const getDefaultID = <S extends State>(classState: ClassState<S>): string => {
  return classState.defaultID ?? ''
}

export const getRootID = <S extends State>(classState: ClassState<S>): string => {
  console.warn('[DEPRECATE] getRootID will be deprecated in 10.2.0.')
  return getDefaultID(classState)
}

export const getNode = <S extends State>(
  classState: ClassState<S>,
  myID?: string,
): NodeState<S> | null => {
  const theID = myID ? myID : getDefaultID(classState)
  if (!theID) {
    return null
  }

  return classState.nodes[theID] || null
}

export const getState = <S extends State>(classState: ClassState<S>, myID?: string): S | null => {
  const theID = myID ? myID : getDefaultID(classState)
  if (!theID) {
    return null
  }

  const me = classState.nodes[theID]
  if (!me) {
    return null
  }
  return me.state
}
