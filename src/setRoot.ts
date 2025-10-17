import type { BaseAction } from './action'
import type { ClassState, State } from './stateTypes'

export const SET_ROOT = '@chhsiao1981/use-thunk/SET_ROOT'
export const setRoot = (myID: string): BaseAction => ({
  myID,
  type: SET_ROOT,
})

export const reduceSetRoot = <S extends State>(classState: ClassState<S>, action: BaseAction): ClassState<S> => {
  const { myID } = action

  return Object.assign({}, classState, { root: myID })
}
