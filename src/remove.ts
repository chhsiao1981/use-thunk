import type { BaseAction, Thunk } from './action'
import type { ClassState, NodeStateMap, State } from './stateTypes'

export const remove = <S extends State>(myID: string): Thunk<S> => {
  return (dispatch, getClassState) => {
    const state = getClassState()
    const {
      nodes: { [myID]: me },
    } = state
    if (!me) {
      return
    }

    // remove me from myClass list
    dispatch(removeCore(myID))
  }
}

export const REMOVE = '@chhsiao1981/use-thunk/REMOVE'
const removeCore = (myID: string): BaseAction => ({
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

  // root
  const newState = Object.assign({}, classState, { nodes: newNodes })
  if (newState.root === myID) {
    newState.root = null
  }

  return newState
}
