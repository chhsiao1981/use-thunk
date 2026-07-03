import { type State as _State, doMod, genID, type Thunk } from '../src'

export const name = 'test/parent'

import * as ModChild from './child'

export interface State extends _State {
  count: number
  childID0: string
  childID1: string
}

export const defaultState: Readonly<State> = {
  count: 0,
  childID0: genID(),
  childID1: genID(),
}

export const increment = (myID: string): Thunk<State> => {
  return (set, _get, getOrNull) => {
    const me = getOrNull(myID)
    const count = me?.count || 0

    set(myID, { count: count + 1 })
  }
}

export const resetChildID0 = (myID: string, childID0: string): Thunk<State> => {
  return (set, get) => {
    const { childID0: origChildID0 } = get(myID)
    const doChild = doMod<ModChild.State, typeof ModChild>(ModChild.name)
    doChild.remove(origChildID0)
    set(myID, { childID0 })
  }
}

export const resetChildID1 = (myID: string, childID1: string): Thunk<State> => {
  return (set) => {
    set(myID, { childID1 })
  }
}
