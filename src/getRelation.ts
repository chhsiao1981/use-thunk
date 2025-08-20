import { type NodeState, Relation, type State } from './stateTypes'

export const getChildIDs = <S extends State>(me: NodeState<S>, childClass: string): string[] => {
  return getRelationIDs(me, childClass, Relation.CHILDREN)
}

export const getChildID = <S extends State>(me: NodeState<S>, childClass: string): string => {
  return getRelationID(me, childClass, Relation.CHILDREN)
}

export const getLinkIDs = <S extends State>(me: NodeState<S>, linkClass: string): string[] => {
  return getRelationIDs(me, linkClass, Relation.LINKS)
}

export const getLinkID = <S extends State>(me: NodeState<S>, linkClass: string): string => {
  return getRelationID(me, linkClass, Relation.LINKS)
}

const getRelationIDs = <S extends State>(me: NodeState<S>, relationClass: string, relationName: Relation): string[] => {
  const relations = me[relationName]
  if (!relations) {
    return []
  }
  const relationsByClass = relations[relationClass]
  if (!relationsByClass) {
    return []
  }

  return relationsByClass.list
}

const getRelationID = <S extends State>(me: NodeState<S>, relationClass: string, relationName: Relation): string => {
  const ids = getRelationIDs(me, relationClass, relationName)
  return ids.length ? ids[0] : ''
}
