import type { BaseAction } from '../action'
import type { ModuleState, NodeState, State } from '../states'
import type { Thunk } from '../thunk'
import { deepCopy } from '../utils'
import { setDefaultID } from './setDefaultID'

export const UPSERT = '@chhsiao1981/use-thunk/UPSERT'
export const upsert = <S extends State>(myID: string, data: Partial<S>): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    set(upsertCore(myID, data))

    const { defaultID } = getModuleState()

    if (!defaultID) {
      set(setDefaultID(myID))
    }
  }
}

const upsertCore = <S extends State>(myID: string, data: Partial<S>): BaseAction => ({
  myID,
  type: UPSERT,
  data,
})

export const reduceUpsert = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { myID, data } = action

  const myNode = moduleState.nodes[myID]
  const node: NodeState<S> = myNode ?? { id: myID, state: deepCopy(moduleState.defaultState) }

  const newState = Object.assign({}, node.state, data)
  const newNode = Object.assign({}, node, { state: newState })
  const newNodes = Object.assign({}, moduleState.nodes, { [myID]: newNode })
  const newModuleState = Object.assign({}, moduleState, { nodes: newNodes })

  return newModuleState
}
