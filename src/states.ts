import type { ClassState, NodeState, State } from './stateTypes'

export const getDefaultID = <S extends State>(classState: ClassState<S>): string => {
  return classState.defaultID ?? ''
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

export const getStateOrNull = <S extends State>(classState: ClassState<S>, myID?: string): S | null => {
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

export const getState = <S extends State>(classState: ClassState<S>, myID?: string): S => {
  return getStateOrNull(classState, myID) || classState.defaultState
}
