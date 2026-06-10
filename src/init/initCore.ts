import type BaseAction from '../action/baseAction'
import type { ClassState, NodeState, NodeStateMap, State } from '../stateTypes'

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
  classState: ClassState<S>,
  action: BaseAction,
): ClassState<S> => {
  const { myID, state } = action as InitAction<S>

  const myNode: NodeState<S> = {
    id: myID,
    state: state,
  }
  const newNodes: NodeStateMap<S> = Object.assign({}, classState.nodes, { [myID]: myNode })
  const newClassState: ClassState<S> = Object.assign({}, classState, { nodes: newNodes })

  return newClassState
}
