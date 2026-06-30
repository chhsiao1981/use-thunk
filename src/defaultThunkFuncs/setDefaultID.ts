import type { BaseAction } from '../action'
import type { ModuleState, State } from '../states'

export const SET_DEFAULT_ID = '@chhsiao1981/use-thunk/SET_DEFAULT_ID'

/**
 * set default id
 * @param id id
 * @returns BaseAction
 */
export const setDefaultID = (id: string): BaseAction => ({
  id,
  type: SET_DEFAULT_ID,
})

export const reduceSetDefaultID = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { id } = action

  // update moduleState
  moduleState.defaultID = id

  return moduleState
}
