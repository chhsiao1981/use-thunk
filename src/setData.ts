import type { BaseAction } from './action'
import type { ClassState, State } from './stateTypes'

export const SET_DATA = 'react-reducer-utils/SET_DATA'
export const setData = <S extends State>(myID: string, data: S): BaseAction => ({
  myID,
  type: SET_DATA,
  data,
})

export const reduceSetData = <S extends State>(state: ClassState<S>, action: BaseAction): ClassState<S> => {
  const { myID, data } = action

  const me = state.nodes[myID]
  if (!me) return state

  const newMyState = Object.assign({}, me.state, data)
  const newMe = Object.assign({}, me, { state: newMyState })
  const newNodes = Object.assign({}, state.nodes, { [myID]: newMe })
  const newState = Object.assign({}, state, { nodes: newNodes })

  return newState
}
