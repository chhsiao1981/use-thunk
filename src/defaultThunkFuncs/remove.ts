import type { BaseAction } from '../action'
import type { ModuleState, NodeStateMap, State } from '../states'

export const REMOVE = '@chhsiao1981/use-thunk/REMOVE'
export const remove = (myID: string): BaseAction => ({
  myID,
  type: REMOVE,
})

export const reduceRemove = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { myID } = action

  const myNode = moduleState.nodes[myID]
  if (!myNode) {
    return moduleState
  }

  const newNodes = Object.keys(moduleState.nodes)
    .filter((each) => each !== myID)
    .reduce((r: NodeStateMap<S>, x) => {
      r[x] = moduleState.nodes[x]
      return r
    }, {})

  // defaultID
  const newModuleState = Object.assign({}, moduleState, { nodes: newNodes })
  if (newModuleState.defaultID === myID) {
    newModuleState.defaultID = null
  }

  return newModuleState
}
