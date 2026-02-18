import type { BaseAction, Thunk } from './action'
import { genUUID } from './genUUID'
import { setDefaultID } from './setDefaultID'
import type { ClassState, NodeState, NodeStateMap, State } from './stateTypes'

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

    const { state } = params
    dispatch(initCore(myID, state))

    const { defaultID } = getClassState()

    if (!defaultID) {
      dispatch(setDefaultID(myID))
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

export const INIT = '@chhsiao1981/use-thunk/INIT'
const initCore = <S extends State>(myID: string, state: S): InitAction<S> => {
  return {
    myID,
    type: INIT,
    state,
  }
}

export const reduceInit = <S extends State>(
  classState: ClassState<S>,
  action: InitAction<S>,
): ClassState<S> => {
  const { myID, state } = action

  const myNode: NodeState<S> = {
    id: myID,
    state: state,
  }
  const newNodes: NodeStateMap<S> = Object.assign({}, classState.nodes, { [myID]: myNode })
  const newClassState: ClassState<S> = Object.assign({}, classState, { nodes: newNodes })

  return newClassState
}
