import type { BaseAction } from '../../action'
import { ensureDefaultID, type ModuleState, type State, setNewNode } from '../../states'
import { deepCopy } from '../../utils'

export interface InitAction<S extends State> extends BaseAction {
  state?: S
}

export const INIT = '@chhsiao1981/use-thunk/INIT'
export default <S extends State>(id: string, state?: S): InitAction<S> => ({
  id,
  type: INIT,
  state,
})

export const reduceInit = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { id, state: propsState } = action as InitAction<S>
  if (!id) {
    return moduleState
  }

  ensureDefaultID(moduleState, id, true)

  const state = propsState || deepCopy(moduleState.defaultState)

  setNewNode(id, state, moduleState, false)

  return moduleState
}
