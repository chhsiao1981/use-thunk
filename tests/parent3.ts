import { type State as _State, getMod, getStateByModule, type Thunk } from '../src'

export const name = 'test/parent3'

import { name as child3Name, type State as child3State } from './child3'

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

export const initChild = (childID: string): Thunk<State> => {
  return () => {
    const child3Module = getMod<child3State>(child3Name)
    getStateByModule(child3Module, childID)
  }
}

export const increment = (myID: string): Thunk<State> => {
  return (set, _get, getOrNull) => {
    const me = getOrNull(myID)
    const count = me?.count || 0

    set(myID, { count: count + 1 })
  }
}
