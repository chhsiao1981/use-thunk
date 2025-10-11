import { type AddRelationAction, reduceAddRelation } from './addRelation'
import { type ClassState, type NodeMeta, Relation, type State } from './stateTypes'

export const ADD_CHILD = '@chhsiao1981/use-thunk/ADD_CHILD'
export const addChild = (myID: string, child: NodeMeta): AddRelationAction => ({
  myID,
  type: ADD_CHILD,
  relaton: child,
})

export const reduceAddChild = <S extends State>(state: ClassState<S>, action: AddRelationAction): ClassState<S> => {
  return reduceAddRelation(state, action, Relation.CHILDREN)
}
