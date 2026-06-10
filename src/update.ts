import type { BaseAction } from './action'
import type { ClassState, State } from './stateTypes'

export const UPDATE = '@chhsiao1981/use-thunk/UPDATE'
export const update = <S extends State>(myID: string, data: Partial<S>): BaseAction => ({
  myID,
  type: UPDATE,
  data,
})

export const setData = <S extends State>(myID: string, data: Partial<S>): BaseAction => {
  console.warn('setData will be deprecated in the next version.')
  return update(myID, data)
}

export const reduceUpdate = <S extends State>(
  classState: ClassState<S>,
  action: BaseAction,
): ClassState<S> => {
  const { myID, data } = action

  const myNode = classState.nodes[myID]
  if (!myNode) return classState

  const newMyState = Object.assign({}, myNode.state, data)
  const newMyNode = Object.assign({}, myNode, { state: newMyState })
  const newNodes = Object.assign({}, classState.nodes, { [myID]: newMyNode })
  const newClassState = Object.assign({}, classState, { nodes: newNodes })

  return newClassState
}
