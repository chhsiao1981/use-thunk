import type { ThunkModule, toDoModule } from '../thunkModule'
import type { UseThunkModuleState } from '../useThunk'
import { deepCopy, genID } from '../utils'
import type { ModuleState, NodeState, NodeStateMap, State } from './types'

export type { ModuleState, NodeState, NodeStateMap, State }

/**
 * get defaultID
 *
 * @param moduleState module state
 * @returns defaultID
 */
export const getDefaultID = <S extends State>(moduleState: ModuleState<S>) => {
  return moduleState.defaultID
}

/**
 * XXX (moduleState) set theID to defaultID if defaultID does not exist.
 *
 * ensuring defaultID.
 *
 * @param id id. use ensured defaultID if id is not provided.
 * @param moduleState module state.
 * @returns theID
 */
export const ensureDefaultID = <S extends State>(
  id: string | null | undefined,
  moduleState: ModuleState<S>,
): string => {
  const theID = id ? id : getDefaultID(moduleState) || genID()
  // XXX ensure that defaultID is set.
  if (!moduleState.defaultID) {
    moduleState.defaultID = theID
  }
  return theID
}

/**
 * get node from module state.
 * return null if node does not exist.
 *
 * @param moduleState module state.
 * @param id id. use defaultID if id is not provided.
 * @returns node or null.
 */
export const getNodeOrNullByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
): Readonly<NodeState<S> | null> => {
  const theID = id ? id : getDefaultID(moduleState)
  if (!theID) {
    return null
  }

  return moduleState.nodes[theID] || null
}

/**
 * get state from module state.
 * return null if state does not exist.
 *
 * @param moduleState module state.
 * @param id id. use defaultID if id is not provided.
 * @returns state or null
 */
export const getStateOrNullByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
): Readonly<S | null> => {
  const theID = id ? id : getDefaultID(moduleState)
  if (!theID) {
    return null
  }

  const me = moduleState.nodes[theID]
  if (!me) {
    return null
  }

  return me.state
}

/**
 * XXX (moduleState) set theID to defaultID if defaultID does not exist.
 *
 * XXX (moduleState): set state as defaultState if state does not exist.
 *
 * get state from moduleState.
 *
 * @param moduleState moduleState.
 * @param id id. use ensured defaultID if id is not provided.
 * @returns state: Readonly<S>
 */
export const getStateByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
): Readonly<S> => {
  const theID = ensureDefaultID(id, moduleState)

  const state = getStateOrNullByModule(moduleState, theID)
  if (state) {
    return state
  }

  // XXX magic for new nodes
  const newState = deepCopy(moduleState.defaultState)
  const newNode = { id: theID, state: newState }
  moduleState.nodes[theID] = newNode

  return newState
}

/**
 * XXX (moduleState) set theID to defaultID if defaultID does not exist.
 *
 * XXX (moduleState): set state as defaultState if state does not exist.
 *
 * get state from useThunkModuleState ([moduleState, doModule]).
 *
 * @param theUseThunkModuleState useThunkModuleState
 * @param id id. use ensured defaultID if id is not provided.
 * @returns [state: Readonly<S>, doModule: toDoModule<S, T>, theID (defaultID if id is not provided.)]
 */
export const getState = <S extends State, T extends ThunkModule<S>>(
  theUseThunkModuleState: UseThunkModuleState<S, T>,
  id?: string | null,
): [Readonly<S>, toDoModule<S, T>, string] => {
  const [moduleState, doModule] = theUseThunkModuleState
  const theID = ensureDefaultID(id, moduleState)
  const state = getStateByModule(moduleState, theID)
  return [state, doModule, theID]
}
