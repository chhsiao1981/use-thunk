import type { BaseAction } from './action'
import type { ClassState, State } from './stateTypes'

export const SET_ROOT = 'react-reducer-utils/SET_ROOT'
export const setRoot = (myID: string): BaseAction => ({
  myID,
  type: SET_ROOT,
})

export const reduceSetRoot = <S extends State>(state: ClassState<S>, action: BaseAction): ClassState<S> => {
  const { myID } = action

  return Object.assign({}, state, { root: myID })
}
