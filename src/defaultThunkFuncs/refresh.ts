import type { BaseAction } from '../action'
import type { ModuleState, State } from '../states'

export const REFRESH = '@chhsiao1981/use-thunk/REFRESH'

/**
 * force refreshing (re-rendering) module state.
 * @returns BaseAction
 */
export const refresh = (): BaseAction => ({
  id: '',
  type: REFRESH,
})

export const reduceRefresh = <S extends State>(
  moduleState: ModuleState<S>,
  _action: BaseAction,
): ModuleState<S> => {
  return moduleState
}
