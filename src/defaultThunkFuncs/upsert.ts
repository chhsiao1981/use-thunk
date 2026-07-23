import type { BaseAction } from '../action'
import { ensureDefaultID, ensureID, type ModuleState, type State, setNewNode } from '../states'
import type { Thunk } from '../thunk'
import { type CustomGenID, deepCopy, partialShallowEq } from '../utils'
import { parseArg } from './utils'

export const UPSERT = 'use-thunk/UPSERT'

/**
 * update the data. create the state in moduleState first if state is not in moduleState.
 *
 * @param idOrData: id or data. use defaultID if this is data.
 * @param data: data. should not be specified if idOrData is data.
 * @param customGenID customized gen-id (used if id is falsy)
 * @returns Thunk<S>
 */
export const upsert = <S extends State>(
  idOrData: Partial<S> | string | null | undefined,
  data?: Partial<S>,
  customGenID?: CustomGenID,
): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    const [argID, argData] = parseArg<Partial<S>>(idOrData, data)
    if (!argData) {
      return
    }

    const theID = ensureID(argID, getModuleState(), customGenID)
    ensureDefaultID(getModuleState(), theID, argID)

    set(upsertCore(theID, argData))
  }
}

interface UpsertAction<S extends State> extends BaseAction {
  data: Partial<S>
}

export const upsertCore = <S extends State>(id: string, data: Partial<S>): UpsertAction<S> => ({
  id,
  type: UPSERT,
  data,
})

export const reduceUpsert = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { id, data } = action as UpsertAction<S>
  if (!id) {
    return moduleState
  }

  if (!moduleState.nodes[id]) {
    setNewNode(id, deepCopy(moduleState.defaultState), moduleState, false)
  }

  const node = moduleState.nodes[id]
  if (partialShallowEq(node.stateAndIsDefaultID.state, data)) {
    // early return if actually no update.
    return moduleState
  }

  const newState: S = Object.assign({}, node.stateAndIsDefaultID.state, data)
  const { isDefaultID } = node.stateAndIsDefaultID
  node.stateAndIsDefaultID = { state: newState, isDefaultID }

  return moduleState
}
