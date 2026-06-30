import type { BaseAction } from '../action'
import { getDefaultID, type ModuleState, type NodeStateMap, type State } from '../states'
import type { Thunk } from '../thunk'

export const REMOVE = '@chhsiao1981/use-thunk/REMOVE'

/**
 * remove
 *
 * remove the state.
 *
 * @param id id. use defaultID if this is not specified.
 * @returns Thunk<S>
 */
export const remove = <S extends State>(id?: string | null): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    const theID = id || getDefaultID(getModuleState())
    if (!theID) {
      return
    }

    set(removeCore(theID))
  }
}

export const removeCore = (id: string): BaseAction => ({
  id,
  type: REMOVE,
})

export const reduceRemove = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { id } = action

  const node = moduleState.nodes[id]
  if (!node) {
    return moduleState
  }

  const newNodes = Object.keys(moduleState.nodes)
    .filter((each) => each !== id)
    .reduce((r: NodeStateMap<S>, x) => {
      r[x] = moduleState.nodes[x]
      return r
    }, {})

  // defaultID
  const newModuleState = Object.assign({}, moduleState, { nodes: newNodes })
  if (newModuleState.defaultID === id) {
    newModuleState.defaultID = null
  }

  return newModuleState
}
