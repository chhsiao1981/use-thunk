import { type NodeState, Relation, type State } from './stateTypes'

export const getChildIDs = <S extends State>(myNode: NodeState<S>, childClass: string): string[] => {
  return getRelationIDs(myNode, childClass, Relation.CHILDREN)
}

export const getChildID = <S extends State>(myNode: NodeState<S>, childClass: string): string => {
  return getRelationID(myNode, childClass, Relation.CHILDREN)
}

export const getLinkIDs = <S extends State>(myNode: NodeState<S>, linkClass: string): string[] => {
  return getRelationIDs(myNode, linkClass, Relation.LINKS)
}

export const getLinkID = <S extends State>(myNode: NodeState<S>, linkClass: string): string => {
  return getRelationID(myNode, linkClass, Relation.LINKS)
}

const getRelationIDs = <S extends State>(
  myNode: NodeState<S>,
  relationClass: string,
  relationName: Relation,
): string[] => {
  const relations = myNode[relationName]
  if (!relations) {
    return []
  }
  const relationsByClass = relations[relationClass]
  if (!relationsByClass) {
    return []
  }

  return relationsByClass.list
}

const getRelationID = <S extends State>(
  myNode: NodeState<S>,
  relationClass: string,
  relationName: Relation,
): string => {
  const ids = getRelationIDs(myNode, relationClass, relationName)
  return ids.length ? ids[0] : ''
}
