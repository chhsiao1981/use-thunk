import type { State } from '../../states'
import type { Thunk } from '../../thunk'
import { genID } from '../../utils'
import { setDefaultID } from '../setDefaultID'
import initCore, { INIT, reduceInit } from './initCore'
export { INIT, reduceInit }

// InitParams
// Sometimes we don't want to specify myID.
// Therefore, we use {} to have myID be optional.
export interface InitParams<S extends State> {
  myID?: string
  state: S
}

export const init = <S extends State>(params: InitParams<S>): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    const myID = params.myID ?? genID()

    const { state } = params
    set(initCore(myID, state))

    const { defaultID } = getModuleState()

    if (!defaultID) {
      set(setDefaultID(myID))
    }
  }
}
