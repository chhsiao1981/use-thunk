import type { BaseAction } from '../../action'
import type { ModuleState, NodeState, State } from '../../states'

export interface InitAction<S extends State> extends BaseAction {
  state: S
}

export const INIT = '@chhsiao1981/use-thunk/INIT'
export default <S extends State>(id: string, state: S): InitAction<S> => ({
  id,
  type: INIT,
  state,
})

export const reduceInit = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { id, state } = action as InitAction<S>

  const node: NodeState<S> = {
    id,
    state,
  }

  // update moduleState
  moduleState.nodes[id] = node

  return moduleState
}
