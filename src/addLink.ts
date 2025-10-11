import type { Thunk } from './action'
import { type AddRelationAction, reduceAddRelation } from './addRelation'
import { type ClassState, type NodeMeta, Relation, type State } from './stateTypes'

export const addLink = <S extends State>(myID: string, link: NodeMeta, isFromLink = false): Thunk<S> => {
  return (dispatch, getClassState) => {
    dispatch(addLinkCore(myID, link))

    if (!isFromLink) {
      // I connect to the other, would like the other to connect to me as well.
      // @ts-expect-error XXX doMe is a hidden variable for links.
      const { doMe, myClass } = getClassState()
      link.do.addLink(link.id, { id: myID, theClass: myClass, do: doMe }, true)
    }
  }
}

export const ADD_LINK = '@chhsiao1981/use-thunk/ADD_LINK'
const addLinkCore = (myID: string, link: NodeMeta): AddRelationAction => ({
  myID,
  type: ADD_LINK,
  relaton: link,
})

export const reduceAddLink = <S extends State>(state: ClassState<S>, action: AddRelationAction): ClassState<S> => {
  return reduceAddRelation(state, action, Relation.LINKS)
}
