import type { Thunk } from '../action'
import { genUUID } from '../genUUID'
import { setDefaultID } from '../setDefaultID'
import type { State } from '../stateTypes'
import initCore from './initCore'

// InitParams
export interface InitParams<S extends State> {
  myID?: string
  state: S
}

export const init = <S extends State>(params: InitParams<S>, myuuidv4?: () => string): Thunk<S> => {
  return (dispatch, getClassState) => {
    const myID = params.myID ?? genUUID(myuuidv4)

    const { state } = params
    dispatch(initCore(myID, state))

    const { defaultID } = getClassState()

    if (!defaultID) {
      dispatch(setDefaultID(myID))
    }
  }
}
