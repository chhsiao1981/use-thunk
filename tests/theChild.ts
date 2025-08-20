import {
  init as _init,
  type DispatchFuncMap,
  genUUID,
  getState,
  type ModuleToFunc,
  type State as rState,
  setData,
  type Thunk,
} from '../src'

import type * as DoParent from './theParent'

type TDoParent = ModuleToFunc<typeof DoParent>

export const myClass = 'test/theChild'

export interface State extends rState {
  count: number
}

export const defaultState: State = Object.freeze({
  myID: '',
  count: 0,
})

export const init = (
  myID: string,
  parentClass: string,
  parentID: string,
  doParent: DispatchFuncMap<DoParent.State, TDoParent>,
): Thunk<State> => {
  const myIDReal = myID || genUUID()
  return (dispatch, _) => {
    dispatch(_init({ myID: myIDReal, state: defaultState, parentID, doParent, parentClass }))
  }
}

export const increment = (myID: string): Thunk<State> => {
  return (dispatch, getClassState) => {
    const classState = getClassState()
    const me = getState(classState, myID)
    if (!me) {
      return
    }

    const { count } = me

    dispatch(setData(myID, { count: count + 1 }))
  }
}
