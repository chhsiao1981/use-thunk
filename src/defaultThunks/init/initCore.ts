import type { BaseAction } from '../../action'
import type { ModuleState, NodeState, NodeStateMap, State } from '../../states'

export interface InitAction<S extends State> extends BaseAction {
  state: S
}

export const INIT = '@chhsiao1981/use-thunk/INIT'
export default <S extends State>(myID: string, state: S): InitAction<S> => {
  return {
    myID,
    type: INIT,
    state,
  }
}

export const reduceInit = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { myID, state } = action as InitAction<S>

  const myNode: NodeState<S> = {
    id: myID,
    state: state,
  }
  const newNodes: NodeStateMap<S> = Object.assign({}, moduleState.nodes, { [myID]: myNode })
  const newModuleState: ModuleState<S> = Object.assign({}, moduleState, { nodes: newNodes })

  return newModuleState
}
