import { doMod, type ThunkModule, type toDoModule } from '../thunkModule'
import type { UseThunkModuleState } from '../useThunk'
import { deepCopy, genID } from '../utils'
import type { ModuleState, NodeState, NodeStateMap, RefModuleState, State } from './types'

export type { ModuleState, NodeState, NodeStateMap, RefModuleState, State }

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
 * get state from moduleState.
 *
 * [NOTICE] can only be used within thunks or event-handlers in components. use useThunk outside of event-handlers in components.
 *
 * @param moduleState moduleState.
 * @param id id. use ensured defaultID if id is not provided.
 * @param isNoRefresh is not to refresh. used only by getState.
 * @returns state: Readonly<S>
 */
export const getStateByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
  isNoRefresh?: boolean,
): Readonly<S> => {
  const theID = id ? id : getDefaultID(moduleState) || genID()

  const state = getStateOrNullByModule(moduleState, theID)
  const doModule = doMod<S, ThunkModule<S>>(moduleState.name)
  if (state) {
    // ensure default id
    if (!moduleState.defaultID) {
      moduleState.defaultID = id
      if (!isNoRefresh) doModule._refresh()
    }
    return state
  }

  // new state
  const newState = deepCopy(moduleState.defaultState)
  const newNode = { id: theID, state: newState }
  moduleState.nodes[theID] = newNode

  // ensure default id
  if (!moduleState.defaultID) {
    moduleState.defaultID = id
  }
  if (!isNoRefresh) doModule._refresh()

  return newState
}

/**
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

  const theID = id ? id : getDefaultID(moduleState) || genID()

  // XXX getState is used only within useThunk.
  //     useThunk sequentially renders components (green-thread).
  //     Therefore, the 1st component with theID will setup states,
  //     and the rest components with theID automatically receive
  //     the updated moduleState.
  const state = getStateByModule(moduleState, theID, true)
  return [state, doModule, theID]
}
