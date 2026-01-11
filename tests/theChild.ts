import { init as _init, getState, type State as rState, setData, type Thunk } from '../src'

export const myClass = 'test/theChild'

export interface State extends rState {
  count: number
}

export const defaultState: State = Object.freeze({
  count: 0,
})

export const init = (myID: string): Thunk<State> => {
  return (dispatch, _) => {
    dispatch(_init({ myID, state: defaultState }))
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
