import type { BaseAction, Thunk } from './action'
import { genUUID } from './genUUID'
import { setRoot } from './setRoot'
import { type ClassState, type NodeState, type NodeStateMap, PARENT, Relation, type State } from './stateTypes'

// InitParams
export interface InitParams<S extends State> {
  myID?: string
  parentID?: string
  // @ts-expect-error doParent can be any type.
  doParent?: DispatchFuncMap
  parentClass?: string

  state: S
}

export const init = <S extends State>(params: InitParams<S>, myuuidv4?: () => string): Thunk<S> => {
  return (dispatch, getClassState) => {
    const myID = params.myID ?? genUUID(myuuidv4)

    const { parentID, doParent, parentClass, state } = params
    dispatch(initCore(myID, state, parentID, doParent, parentClass))

    // @ts-expect-error XXX doMe is a hidden variable for children.
    const { myClass, doMe, root } = getClassState()

    // parent or root
    if (parentID && doParent) {
      doParent.addChild(parentID, { id: myID, theClass: myClass, do: doMe })
    } else if (!root) {
      dispatch(setRoot(myID))
    }
  }
}

interface InitAction<S extends State> extends BaseAction {
  parentID?: string
  // @ts-expect-error doParent can be any type
  doParent?: DispatchFuncMap
  parentClass?: string

  state: S
}

export const INIT = 'react-reducer-utils/INIT'
const initCore = <S extends State>(
  myID: string,
  state: S,
  parentID?: string,
  // @ts-expect-error doParent can be any type
  doParent?: DispatchFuncMap,
  parentClass?: string,
): InitAction<S> => {
  return {
    myID,
    type: INIT,
    parentID,
    doParent,
    parentClass,

    state,
  }
}

export const reduceInit = <S extends State>(state: ClassState<S>, action: InitAction<S>): ClassState<S> => {
  const { myID, parentID, doParent, parentClass, state: initState } = action

  const me: NodeState<S> = {
    id: myID,
    state: initState,
    [Relation.CHILDREN]: {},
    [Relation.LINKS]: {},
  }
  if (parentID && doParent) {
    me[PARENT] = { id: parentID, do: doParent, theClass: parentClass ?? '' }
  }

  const newNodes: NodeStateMap<S> = Object.assign({}, state.nodes, { [myID]: me })
  const newState: ClassState<S> = Object.assign({}, state, { nodes: newNodes })

  return newState
}
