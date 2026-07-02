import type { BaseAction } from '../action'
import { getID, type ModuleState, type State } from '../states'
import type { Thunk } from '../thunk'
import { partialShallowEq } from '../utils'
import { parseArg } from './utils'

export const UPDATE = '@chhsiao1981/use-thunk/UPDATE'

/**
 * update the data. no update if id or data is invalid.
 *
 * @param idOrData id or data. use defaultID if this is data.
 * @param data data. should not be specified if idOrData is data.
 * @returns Thunk<S>
 */
export const update = <S extends State>(
  idOrData: Partial<S> | string | null | undefined,
  data?: Partial<S>,
): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    const [argID, argData] = parseArg<Partial<S>>(idOrData, data)
    const theID = getID(argID, getModuleState())

    if (!theID || !argData) {
      return
    }

    set(updateCore(theID, argData))
  }
}

interface UpdateAction<S extends State> extends BaseAction {
  data: Partial<S>
}

export const updateCore = <S extends State>(id: string, data: Partial<S>): UpdateAction<S> => ({
  id,
  type: UPDATE,
  data,
})

export const reduceUpdate = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { id, data } = action as UpdateAction<S>
  if (!id) {
    return moduleState
  }

  const node = moduleState.nodes[id]
  if (!node) return moduleState
  if (partialShallowEq(node.stateAndDefaultState.state, data)) {
    // early return if actually no update.
    return moduleState
  }

  const newState: S = Object.assign({}, node.stateAndDefaultState.state, data)

  const { defaultState } = node.stateAndDefaultState
  node.stateAndDefaultState = { state: newState, defaultState }

  return moduleState
}
