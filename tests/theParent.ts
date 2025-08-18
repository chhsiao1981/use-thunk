import { init as _init, genUUID, getState, type State as rState, setData, type Thunk } from '../src'

export const myClass = 'test/theParent'

export interface State extends rState {
  count: number
}

export const defaultState: State = {
  count: 0,
}

export const init = (myID?: string): Thunk<State> => {
  const myIDReal = myID || genUUID()
  return (dispatch, _) => {
    dispatch(_init({ myID: myIDReal, state: defaultState }))
  }
}

export const increment = (myID: string): Thunk<State> => {
  return (dispatch, getClassState) => {
    const classState = getClassState()
    const me = getState(classState, myID)

    console.info('theParent.increment: myID:', myID, 'me:', me)
    if (!me) {
      return
    }

    const { count } = me

    console.info('theParent.increment: to setData: myID:', myID, 'count:', count)

    dispatch(setData(myID, { count: count + 1 }))
  }
}
