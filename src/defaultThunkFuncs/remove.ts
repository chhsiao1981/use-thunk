import type { BaseAction } from '../action'
import { getID, type ModuleState, type State } from '../states'
import type { Thunk } from '../thunk'

export const REMOVE = '@chhsiao1981/use-thunk/REMOVE'

/**
 * remove the state.
 *
 * @param id id. use defaultID if this is not specified.
 * @returns Thunk<S>
 */
export const remove = <S extends State>(id?: string | null): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    const theID = getID(id, getModuleState())

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
  if (!id) {
    return moduleState
  }

  const node = moduleState.nodes[id]
  if (!node) {
    return moduleState
  }

  // update moduleState
  delete moduleState.nodes[id]
  if (moduleState.defaultID === id) {
    moduleState.defaultID = null
  }

  return moduleState
}
