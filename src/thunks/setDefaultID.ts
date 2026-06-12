import type BaseAction from '../action/baseAction'
import type { ModuleState, State } from '../stateTypes'

export const SET_DEFAULT_ID = '@chhsiao1981/use-thunk/SET_DEFAULT_ID'
export const setDefaultID = (myID: string): BaseAction => ({
  myID,
  type: SET_DEFAULT_ID,
})

export const reduceSetDefaultID = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  const { myID } = action

  const toUpdate: Partial<ModuleState<S>> = { defaultID: myID, isInitDefaultID: true }
  return Object.assign({}, moduleState, toUpdate)
}
