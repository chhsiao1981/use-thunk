import type { BaseAction, Thunk } from './action'
import { removeChild } from './removeChild'
import { removeLink } from './removeLink'
import { type ClassState, type NodeStateMap, PARENT, Relation, type State } from './stateTypes'

export const remove = <S extends State>(myID: string, isFromParent = false): Thunk<S> => {
  return (dispatch, getClassState) => {
    const state = getClassState()
    const {
      myClass,
      nodes: { [myID]: me },
    } = state
    if (!me) {
      return
    }

    // parent removes me
    const parent = me[PARENT]
    if (!isFromParent && parent) {
      const { id: parentID, do: doParent } = parent
      if (parentID) {
        doParent.removeChild(parentID, myID, myClass, true)
      }
    }

    // remove children
    const children = me[Relation.CHILDREN]
    if (children) {
      const realChildren = children
      Object.keys(realChildren).map((eachClass) => {
        const child = realChildren[eachClass]
        child.list.map((eachID) => dispatch(removeChild(myID, eachID, eachClass, false)))
      })
    }

    // remove links
    const links = me[Relation.LINKS] ?? {}
    Object.keys(links).map((eachClass) => {
      const link = links[eachClass]
      link.list.map((eachID) => dispatch(removeLink(myID, eachID, eachClass, false)))
    })

    // remove me from myClass list
    dispatch(removeCore(myID))
  }
}

export const REMOVE = '@chhsiao1981/use-thunk/REMOVE'
const removeCore = (myID: string): BaseAction => ({
  myID,
  type: REMOVE,
})

export const reduceRemove = <S extends State>(classState: ClassState<S>, action: BaseAction): ClassState<S> => {
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
