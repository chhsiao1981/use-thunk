import type { State as rState, Thunk } from '../src'

export const name = 'test/theParent'

export interface State extends rState {
  count: number
  theDate: Date
  theAry: number[]
}

export const defaultState: State = Object.freeze({
  count: 0,
  theDate: new Date(),
  theAry: [],
})

export const increment = (myID: string): Thunk<State> => {
  return (set, get) => {
    const me = get(myID)
    if (!me) {
      return
    }

    const { count } = me
    set(myID, { count: count + 1 })
  }
}
