import type { BaseAction } from './action'
import type { ClassState, State } from './stateTypes'

export const SET_DEFAULT_ID = '@chhsiao1981/use-thunk/SET_DEFAULT_ID'
export const setDefaultID = (myID: string): BaseAction => ({
  myID,
  type: SET_DEFAULT_ID,
})

export const reduceSetDefaultID = <S extends State>(
  classState: ClassState<S>,
  action: BaseAction,
): ClassState<S> => {
  const { myID } = action

  return Object.assign({}, classState, { defaultID: myID })
}
