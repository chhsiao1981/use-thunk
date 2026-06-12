import type { BaseAction } from '../action'
import type { ModuleState, State } from '../states'

export const UPDATE = '@chhsiao1981/use-thunk/UPDATE'
export const update = <S extends State>(myID: string, data: Partial<S>): BaseAction => ({
  myID,
  type: UPDATE,
  data,
})

export const reduceUpdate = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { myID, data } = action

  const myNode = moduleState.nodes[myID]
  if (!myNode) return moduleState

  const newMyState = Object.assign({}, myNode.state, data)
  const newMyNode = Object.assign({}, myNode, { state: newMyState })
  const newNodes = Object.assign({}, moduleState.nodes, { [myID]: newMyNode })
  const newModuleState = Object.assign({}, moduleState, { nodes: newNodes })

  return newModuleState
}
