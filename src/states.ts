import type { setMap } from './setMap'
import type { ModuleState, NodeState, State } from './stateTypes'
import type { ThunkModuleFunc } from './thunkModule'
import type { UseThunk } from './useThunk'

export const getDefaultID = <S extends State>(moduleState: ModuleState<S>): string => {
  return moduleState.defaultID ?? ''
}

export const getNode = <S extends State>(
  moduleState: ModuleState<S>,
  myID?: string,
): NodeState<S> | null => {
  const theID = myID ? myID : getDefaultID(moduleState)
  if (!theID) {
    return null
  }

  return moduleState.nodes[theID] || null
}

export const getState = <S extends State>(moduleState: ModuleState<S>, myID?: string): S | null => {
  const theID = myID ? myID : getDefaultID(moduleState)
  if (!theID) {
    return null
  }

  const me = moduleState.nodes[theID]
  if (!me) {
    return null
  }
  return me.state
}

export const mustGetState = <S extends State>(moduleState: ModuleState<S>, myID?: string): S => {
  return getState(moduleState, myID) || moduleState.defaultState
}

export const mustGetStateByThunk = <S extends State, R extends ThunkModuleFunc<S>>(
  theUseThunk: UseThunk<S, R>,
  myID?: string,
): [S, setMap<S, R>, string] => {
  const [moduleState, theDo] = theUseThunk
  const theID = myID ? myID : getDefaultID(moduleState)
  const state = mustGetState(moduleState, theID)
  return [state, theDo, theID]
}
