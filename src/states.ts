import type { setMap } from './setMap'
import type { ModuleState, NodeState, State } from './stateTypes'
import type { doModule } from './thunkModule'
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

export const getStateOrNullByModule = <S extends State>(
  moduleState: ModuleState<S>,
  myID?: string,
): S | null => {
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

export const getStateByModule = <S extends State>(moduleState: ModuleState<S>, myID?: string): S => {
  return getStateOrNullByModule(moduleState, myID) || moduleState.defaultState
}

export const getState = <S extends State, R extends doModule<S>>(
  theUseThunk: UseThunk<S, R>,
  myID?: string,
): [S, setMap<S, R>, string] => {
  const [moduleState, theDo] = theUseThunk
  const theID = myID ? myID : getDefaultID(moduleState)
  const state = getStateByModule(moduleState, theID)
  return [state, theDo, theID]
}
