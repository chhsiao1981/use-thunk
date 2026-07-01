import type { State as _State, Thunk } from '../src'

export const name = 'test/parent'

export interface State extends _State {
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
  return (set, _get, getOrNull) => {
    const me = getOrNull(myID)
    const count = me?.count || 0

    set(myID, { count: count + 1 })
  }
}
