import type { Thunk } from './action'
import { type RemoveRelationAction, reduceRemoveRelation, removeRelation } from './removeRelation'
import { type ClassState, Relation, type State } from './stateTypes'

/***
 * remove-child
 */
export const removeChild = <S extends State>(
  myID: string,
  childID: string,
  childClass: string,
  isFromChild = false,
): Thunk<S> => {
  return (dispatch, getClassState) => {
    // @ts-expect-error theDo (from child) can by any type
    const relationRemove = (theDo: DispatchFuncMap) => theDo.remove(childID, true)
    removeRelation(
      dispatch,
      getClassState,
      myID,
      childID,
      childClass,
      isFromChild,
      relationRemove,
      removeChildCore,
      Relation.CHILDREN,
    )
  }
}

export const REMOVE_CHILD = 'react-reducer-utils/REMOVE_CHILD'
const removeChildCore = (myID: string, childID: string, childClass: string): RemoveRelationAction => ({
  myID,
  type: REMOVE_CHILD,
  relationID: childID,
  relationClass: childClass,
})

export const reduceRemoveChild = <S extends State>(
  state: ClassState<S>,
  action: RemoveRelationAction,
): ClassState<S> => {
  const { myID, relationID, relationClass } = action

  return reduceRemoveRelation(state, myID, relationID, relationClass, Relation.CHILDREN)
}
