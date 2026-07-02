import { getStateOrNullByModule } from './getStateOrNullByModule'
import { ensureID } from './id'
import { ensureNode } from './node'
import type { ModuleState, State } from './types'

/**
 * get state from moduleState.
 *
 * [NOTICE] can only be used within thunks or event-handlers/effect hooks in components. use useThunk or getStateOrNullByModule outside of event-handlers/effect hooks in components.
 *
 * @param moduleState moduleState.
 * @param id id. use ensured defaultID if id is not provided.
 * @returns state: Readonly<S>
 */
export const getStateByModule = <S extends State>(
  moduleState: ModuleState<S>,
  id?: string | null,
): Readonly<S> => {
  const theID = ensureID(id, moduleState)

  ensureNode(moduleState, theID, false)

  // We have ensured node
  const state = getStateOrNullByModule(moduleState, theID) as Readonly<S>

  return state
}
