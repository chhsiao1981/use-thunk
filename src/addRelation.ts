import type { BaseAction } from './action'
import type { ClassState, NodeMeta, Relation, State } from './stateTypes'

export interface AddRelationAction extends BaseAction {
  relaton: NodeMeta
}

export const reduceAddRelation = <S extends State>(
  classState: ClassState<S>,
  action: AddRelationAction,
  relationName: Relation,
): ClassState<S> => {
  const { myID, relaton: relation } = action
  const myNode = classState.nodes[myID]
  if (!myNode) {
    return classState
  }

  const { theClass, id: theID, do: theDo } = relation

  const relations = myNode[relationName] ?? {}
  const relationsByClass = relations[theClass] ?? { list: [] }
  const relationIDs = relationsByClass.list ?? []
  const newIDs = theID ? relationIDs.concat([theID]) : relationIDs

  const newRelations = Object.assign({}, myNode[relationName], { [theClass]: { list: newIDs, do: theDo } })
  const newMyNode = Object.assign({}, myNode, { [relationName]: newRelations })
  const newNodes = Object.assign({}, classState.nodes, { [myID]: newMyNode })
  const newClassState = Object.assign({}, classState, { nodes: newNodes })

  return newClassState
}
