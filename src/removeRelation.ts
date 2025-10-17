import type { BaseAction, GetClassState } from './action'
import type { Dispatch } from './dispatch'
import type { ClassState, Relation, State } from './stateTypes'

export interface RemoveRelationAction extends BaseAction {
  relationID: string
  relationClass: string
}

// @ts-expect-error DispatchFuncMap can be any type
type RelationRemove = (theDo: DispatchFuncMap) => void
type RemoveRelationCore = (myID: string, relationID: string, relationClass: string) => BaseAction

export const removeRelation = <S extends State>(
  dispatch: Dispatch<S>,
  getClassState: GetClassState<S>,
  myID: string,
  relationID: string,
  relationClass: string,
  isFromRelation: boolean,
  relationRemove: RelationRemove,
  removeRelationCore: RemoveRelationCore,
  relationName: Relation,
) => {
  const classState = getClassState()

  const myNode = classState.nodes[myID]
  if (!myNode) {
    return
  }

  const relation = myNode[relationName]
  if (!relation) {
    return
  }
  const relationByClass = relation[relationClass]
  if (!relationByClass) {
    return
  }

  const newIDs = relationByClass.list.filter((eachID: string) => eachID !== relationID)
  if (relationByClass.list.length === newIDs.length) return

  if (!isFromRelation) {
    relationRemove(relationByClass.do)
  }

  dispatch(removeRelationCore(myID, relationID, relationClass))
}

export const reduceRemoveRelation = <S extends State>(
  classState: ClassState<S>,
  myID: string,
  relationID: string,
  relationClass: string,
  relationName: Relation.LINKS | Relation.CHILDREN,
): ClassState<S> => {
  const myNode = classState.nodes[myID]
  if (!myNode) return classState

  const relation = myNode[relationName]
  if (!relation) return classState

  const relationByClass = relation[relationClass]
  if (!relationByClass) return classState

  const relationIDs = relationByClass.list || []
  const newIDs = relationIDs.filter((eachID: string) => eachID !== relationID)
  if (relationIDs.length === newIDs.length) return classState

  const newRelation = Object.assign({}, relation)
  if (newIDs.length === 0) {
    delete newRelation[relationClass]
  } else {
    const newRelationByClass = Object.assign({}, relationByClass, { list: newIDs })
    newRelation[relationClass] = newRelationByClass
  }

  const newMyNode = Object.assign({}, myNode, { [relationName]: newRelation })
  const newNodes = Object.assign({}, classState.nodes, { [myID]: newMyNode })
  const newClassState = Object.assign({}, classState, { nodes: newNodes })

  return newClassState
}
