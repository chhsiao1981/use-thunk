import type BaseAction from './action/baseAction'
import type { ClassState, NodeStateMap, State } from './stateTypes'

export const REMOVE = '@chhsiao1981/use-thunk/REMOVE'
export const remove = (myID: string): BaseAction => ({
  myID,
  type: REMOVE,
})

export const reduceRemove = <S extends State>(
  classState: ClassState<S>,
  action: BaseAction,
): ClassState<S> => {
  const { myID } = action

  const myNode = classState.nodes[myID]
  if (!myNode) {
    return classState
  }

  const newNodes = Object.keys(classState.nodes)
    .filter((each) => each !== myID)
    .reduce((r: NodeStateMap<S>, x) => {
      r[x] = classState.nodes[x]
      return r
    }, {})

  // defaultID
  const newState = Object.assign({}, classState, { nodes: newNodes })
  if (newState.defaultID === myID) {
    newState.defaultID = null
  }

  return newState
}
