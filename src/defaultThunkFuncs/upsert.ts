import type { BaseAction } from '../action'
import { ensureDefaultID, type ModuleState, type NodeState, type State } from '../states'
import type { Thunk } from '../thunk'
import { deepCopy } from '../utils'
import { parseArg } from './utils'

export const UPSERT = '@chhsiao1981/use-thunk/UPSERT'

/**
 * upsert
 *
 * XXX (moduleState) set theID to defaultID if defaultID does not exist.
 *
 * update the data. create the state in moduleState first if state is not in moduleState.
 *
 * @param idOrData: id or data. use defaultID if this is data.
 * @param data: data. should not be specified if idOrData is data.
 * @returns Thunk<S>
 */
export const upsert = <S extends State>(
  idOrData: Partial<S> | string | null | undefined,
  data?: Partial<S>,
): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    const [argID, argData] = parseArg<Partial<S>>(idOrData, data)
    if (!argData) {
      return
    }

    const theID = ensureDefaultID(argID, getModuleState())

    set(upsertCore(theID, argData))
  }
}

interface UpsertAction<S extends State> extends BaseAction {
  data: Partial<S>
}

const upsertCore = <S extends State>(id: string, data: Partial<S>): UpsertAction<S> => ({
  id,
  type: UPSERT,
  data,
})

export const reduceUpsert = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { id, data } = action as UpsertAction<S>

  const node = moduleState.nodes[id]
  const theNode: NodeState<S> = node ?? { id: id, state: deepCopy(moduleState.defaultState) }

  const newState: S = Object.assign({}, theNode.state, data)
  const newNode = Object.assign({}, theNode, { state: newState })
  const newNodes = Object.assign({}, moduleState.nodes, { [id]: newNode })
  const newModuleState = Object.assign({}, moduleState, { nodes: newNodes })

  return newModuleState
}
