import type { BaseAction } from './action'
import type { ClassState, NodeMeta, Relation, State } from './stateTypes'

export interface AddRelationAction extends BaseAction {
  relaton: NodeMeta
}

export const reduceAddRelation = <S extends State>(
  state: ClassState<S>,
  action: AddRelationAction,
  relationName: Relation,
): ClassState<S> => {
  const { myID, relaton: relation } = action
  const me = state.nodes[myID]
  if (!me) {
    return state
  }

  const { theClass, id: theID, do: theDo } = relation

  const relations = me[relationName] ?? {}
  const relationsByClass = relations[theClass] ?? { list: [] }
  const relationIDs = relationsByClass.list ?? []
  const newIDs = theID ? relationIDs.concat([theID]) : relationIDs

  const newRelations = Object.assign({}, me[relationName], { [theClass]: { list: newIDs, do: theDo } })
  const newMe = Object.assign({}, me, { [relationName]: newRelations })
  const newNodes = Object.assign({}, state.nodes, { [myID]: newMe })
  const newState = Object.assign({}, state, { nodes: newNodes })

  return newState
}
