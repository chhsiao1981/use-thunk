import type { ThunkModule, toDoModule } from '../thunkModule'
import type { UseThunk } from '../useThunk'
import { deepCopy, genID } from '../utils'
import type { ModuleState, NodeState, NodeStateMap, State } from './types'

export type { ModuleState, NodeState, NodeStateMap, State }

export const getDefaultID = <S extends State>(moduleState: ModuleState<S>, isMust = false): string => {
  if (moduleState.defaultID) {
    return moduleState.defaultID
  }
  if (!isMust) {
    return ''
  }

  // XXX magic for defaultID
  const defaultID = genID()
  moduleState.defaultID = defaultID
  return defaultID
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
  const theID = myID ? myID : getDefaultID(moduleState, true)

  const state = getStateOrNullByModule(moduleState, theID)
  if (state) {
    return state
  }

  // XXX magic for new nodes
  // 1. reduceInit
  const newState = deepCopy(moduleState.defaultState)
  const newNode = { id: theID, state: newState }
  moduleState.nodes[theID] = newNode

  // 2. check defaultID
  //    we still need this because myID can be specified
  //    and not calling getDefaultID.
  if (!moduleState.defaultID) {
    moduleState.defaultID = theID
  }

  return newState
}

export const getState = <S extends State, T extends ThunkModule<S>>(
  theUseThunk: UseThunk<S, T>,
  myID?: string,
): [Readonly<S>, toDoModule<T>, string] => {
  const [moduleState, doModule] = theUseThunk
  const theID = myID ? myID : getDefaultID(moduleState, true)
  const state = getStateByModule(moduleState, theID)
  return [state, doModule, theID]
}
