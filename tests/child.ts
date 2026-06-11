import { init as _init, type State as rState, type Thunk, update } from '../src'

export const name = 'test/theChild'

export interface State extends rState {
  count: number
}

export const defaultState: State = Object.freeze({
  count: 0,
})

export const init = (myID: string): Thunk<State> => {
  return (set) => {
    set(_init({ myID, state: defaultState }))
  }
}

export const increment = (myID: string): Thunk<State> => {
  return (set, get) => {
    const me = get(myID)
    if (!me) {
      return
    }

    const { count } = me

    set(update<State>(myID, { count: count + 1 }))
  }
}
