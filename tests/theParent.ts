import { init as _init, genUUID, getState, type State as rState, type Thunk, update } from '../src'

export const name = 'test/theParent'

export interface State extends rState {
  count: number
}

export const defaultState: State = Object.freeze({
  count: 0,
})

export const init = (myID?: string): Thunk<State> => {
  const myID2 = myID || genUUID()
  return (set, _) => {
    set(_init({ myID: myID2, state: defaultState }))
  }
}

export const increment = (myID: string): Thunk<State> => {
  return (set, getModuleState) => {
    const moduleState = getModuleState()
    const me = getState(moduleState, myID)
    if (!me) {
      return
    }

    const { count } = me
    set(update<State>(myID, { count: count + 1 }))
  }
}
