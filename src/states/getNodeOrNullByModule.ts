import { getID } from './id'
import type { ModuleState, NodeState, State } from './types'

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
  const theID = getID(id, moduleState)
  if (!theID) {
    return null
  }

  return moduleState.nodes[theID] || null
}
