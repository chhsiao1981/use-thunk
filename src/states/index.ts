import type { setMap } from '../set'
import type { doModule } from '../thunkModule'
import type { UseThunk } from '../useThunk'
import { deepCopy, genID } from '../utils'
import type { ModuleState, NodeState, NodeStateMap, State } from './types'

export type { ModuleState, NodeState, State, NodeStateMap }

export const getDefaultID = <S extends State>(moduleState: ModuleState<S>): string => {
  return moduleState.defaultID ?? ''
}

export const getNodeOrNull = <S extends State>(
  moduleState: ModuleState<S>,
  myID?: string,
): Readonly<NodeState<S> | null> => {
  const theID = myID ? myID : getDefaultID(moduleState)
  if (!theID) {
    return null
  }

  return moduleState.nodes[theID] || null
}

export const getStateOrNullByModule = <S extends State>(
  moduleState: ModuleState<S>,
  myID?: string,
): Readonly<S | null> => {
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

export const getStateByModule = <S extends State>(
  moduleState: ModuleState<S>,
  myID?: string,
): Readonly<S> => {
  const theID = myID ? myID : getDefaultID(moduleState) || genID()

  const state = getStateOrNullByModule(moduleState, theID)
  if (state) {
    return state
  }

  // XXX magic for new nodes
  // 1. reduceInit
  const newState = deepCopy(moduleState.defaultState)
  const newNode = { id: theID, state: newState }
  moduleState.nodes[theID] = newNode

  // 2. already init default-id, no need to init default-id here.
  if (moduleState.isInitDefaultID) {
    return newState
  }

  // 3. check defaultID
  if (!moduleState.defaultID) {
    moduleState.defaultID = theID
    moduleState.isInitDefaultID = true
  }

  return newState
}

export const getState = <S extends State, R extends doModule<S>>(
  theUseThunk: UseThunk<S, R>,
  myID?: string,
): [Readonly<S>, setMap<S, R>, string] => {
  const [moduleState, theDo] = theUseThunk
  const theID = myID ? myID : getDefaultID(moduleState)
  const state = getStateByModule(moduleState, theID)
  return [state, theDo, theID]
}
