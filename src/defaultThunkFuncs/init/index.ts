import type { State } from '../../states'
import type { Thunk } from '../../thunk'
import { deepCopy, genID } from '../../utils'
import { setDefaultID } from '../setDefaultID'
import { parseArg } from '../utils'
import initCore, { INIT, reduceInit } from './initCore'
export { INIT, reduceInit }

/**
 * init
 *
 * init the state. set defaultID if defaultID does not exist.
 *
 * Most of time we don't need to init because get(id) and useThunk
 * automatically init the state if not exist.
 *
 * @param idOrState id or state. generate new ID if this is state.
 * @param state the init state. use defaultState if idOrData is id and this is not specified.
 * @returns Thunk<S>
 */
export const init = <S extends State>(idOrState: S | string | null | undefined, state?: S): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    const [argID, argState] = parseArg<S>(idOrState, state)
    const { defaultState } = getModuleState()
    const theState = argState || deepCopy(defaultState)

    const theID = argID || genID()

    set(initCore(theID, theState))

    const { defaultID } = getModuleState()
    if (!defaultID) {
      set(setDefaultID(theID))
    }
  }
}
