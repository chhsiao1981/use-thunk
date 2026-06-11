import type BaseAction from '../action/baseAction'
import type { ModuleState, NodeStateMap, State } from '../stateTypes'

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
  const newState = Object.assign({}, moduleState, { nodes: newNodes })
  if (newState.defaultID === myID) {
    newState.defaultID = null
  }

  return newState
}
