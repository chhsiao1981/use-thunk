import { getID } from './id'
import type { ModuleState, State } from './types'

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
  const theID = getID(id, moduleState)
  if (!theID) {
    return null
  }

  const me = moduleState.nodes[theID]
  if (!me) {
    return null
  }

  return me.stateAndDefaultState.state
}
