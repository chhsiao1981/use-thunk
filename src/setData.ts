import type { BaseAction } from './action'
import type { ClassState, State } from './stateTypes'

export const SET_DATA = '@chhsiao1981/use-thunk/SET_DATA'
export const setData = <S extends State>(myID: string, data: Partial<S>): BaseAction => ({
  myID,
  type: SET_DATA,
  data,
})

export const reduceSetData = <S extends State>(classState: ClassState<S>, action: BaseAction): ClassState<S> => {
  const { myID, data } = action

  const myNode = classState.nodes[myID]
  if (!myNode) return classState

  const newMyState = Object.assign({}, myNode.state, data)
  const newMyNode = Object.assign({}, myNode, { state: newMyState })
  const newNodes = Object.assign({}, classState.nodes, { [myID]: newMyNode })
  const newClassState = Object.assign({}, classState, { nodes: newNodes })

  return newClassState
}
