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
    console.info('child: to init: myID:', myID)
    set(_init(myID))
  }
}

export const increment = (myID: string, num = 1): Thunk<State> => {
  return (set, get) => {
    const me = get(myID)
    const { count } = me

    set(myID, { count: count + num })
    const me2 = get(myID)
    if (me2 === me) {
      console.error('increment: me2 === me (copy-on-write)')
    }

    // set with no-data.
    set(myID)
    const me3 = get(myID)
    if (me2 !== me3) {
      console.error('increment: me2 !== me3')
    }
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
