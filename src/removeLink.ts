import type { Thunk } from './action'
import { type RemoveRelationAction, reduceRemoveRelation, removeRelation } from './removeRelation'
import { type ClassState, Relation, type State } from './stateTypes'

/***
 * remove-link
 */
export const removeLink = <S extends State>(
  myID: string,
  linkID: string,
  linkClass: string,
  isFromLink = false,
): Thunk<S> => {
  return (dispatch, getClassState) => {
    const myClass = getClassState().myClass
    // @ts-expect-error theDo (from link) can be any type
    const relationRemove = (theDo: DispatchFuncMap) => theDo.removeLink(linkID, myID, myClass, true)
    removeRelation(
      dispatch,
      getClassState,
      myID,
      linkID,
      linkClass,
      isFromLink,
      relationRemove,
      removeLinkCore,
      Relation.LINKS,
    )
  }
}

export const REMOVE_LINK = 'react-reducer-utils/REMOVE_LINK'
const removeLinkCore = (myID: string, linkID: string, linkClass: string): RemoveRelationAction => ({
  myID,
  type: REMOVE_LINK,
  relationID: linkID,
  relationClass: linkClass,
})

export const reduceRemoveLink = <S extends State>(
  state: ClassState<S>,
  action: RemoveRelationAction,
): ClassState<S> => {
  const { myID, relationID, relationClass } = action

  return reduceRemoveRelation(state, myID, relationID, relationClass, Relation.LINKS)
}
