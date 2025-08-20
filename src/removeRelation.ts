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
  const state = getClassState()

  const me = state.nodes[myID]
  if (!me) {
    return
  }

  const relation = me[relationName]
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
  state: ClassState<S>,
  myID: string,
  relationID: string,
  relationClass: string,
  relationName: Relation.LINKS | Relation.CHILDREN,
): ClassState<S> => {
  const me = state.nodes[myID]
  if (!me) return state

  const relation = me[relationName]
  if (!relation) return state

  const relationByClass = relation[relationClass]
  if (!relationByClass) return state

  const relationIDs = relationByClass.list || []
  const newIDs = relationIDs.filter((eachID: string) => eachID !== relationID)
  if (relationIDs.length === newIDs.length) return state

  const newRelation = Object.assign({}, relation)
  if (newIDs.length === 0) {
    delete newRelation[relationClass]
  } else {
    const newRelationByClass = Object.assign({}, relationByClass, { list: newIDs })
    newRelation[relationClass] = newRelationByClass
  }

  const newMe = Object.assign({}, me, { [relationName]: newRelation })
  const newNodes = Object.assign({}, state.nodes, { [myID]: newMe })
  const newState = Object.assign({}, state, { nodes: newNodes })

  return newState
}
