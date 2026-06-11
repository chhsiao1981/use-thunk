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
  return (set, _, getModuleState) => {
    const myID = params.myID ?? genUUID(myuuidv4)

    const { state } = params
    set(initCore(myID, state))

    const { defaultID } = getModuleState()

    if (!defaultID) {
      set(setDefaultID(myID))
    }
  }
}
