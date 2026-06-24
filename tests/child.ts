import { init as _init, type State as _State, type Thunk, update } from '../src'

export const name = 'test/theChild'

export interface State extends _State {
  count: number
}

export const defaultState: State = Object.freeze({
  count: 0,
})

export const init = (myID?: string): Thunk<State> => {
  return (set) => {
    set(_init({ myID, state: defaultState }))
  }
}

export const increment = (myID: string, num = 1): Thunk<State> => {
  return (set, get) => {
    const me = get(myID)
    const { count } = me

    set(myID, { count: count + num })
  }
}

export const increment2 = (myID: string): Thunk<State> => {
  return (set, get) => {
    const me = get(myID)

    const { count } = me

    set(update<State>(myID, { count: count + 2 }))
  }
}

export const increment3 = (myID: string): Thunk<State> => {
  return (set) => {
    set(increment(myID, 3))
  }
}
