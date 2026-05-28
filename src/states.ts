import type { DispatchFuncMap } from './dispatchFuncMap'
import type { ClassState, NodeState, State } from './stateTypes'
import type { ThunkModuleFunc } from './thunk'
import type { UseThunk } from './useThunk'

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

export const mustGetState = <S extends State>(classState: ClassState<S>, myID?: string): S => {
  return getState(classState, myID) || classState.defaultState
}

export const mustGetStateByThunk = <S extends State, R extends ThunkModuleFunc<S>>(
  theUseThunk: UseThunk<S, R>,
  myID?: string,
): [S, DispatchFuncMap<S, R>, string] => {
  const [classState, theDo] = theUseThunk
  const theID = myID ? myID : getDefaultID(classState)
  const state = mustGetState(classState, theID)
  return [state, theDo, theID]
}
