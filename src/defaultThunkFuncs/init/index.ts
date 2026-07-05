import type { State } from '../../states'
import type { Thunk } from '../../thunk'
import { genID } from '../../utils'
import { parseArg } from '../utils'
import initCore, { INIT, reduceInit } from './initCore'
export { INIT, reduceInit }

/**
 * init the state. set defaultID if defaultID does not exist.
 *
 * Most of time we don't need to init because get(id) and useThunk
 * automatically init the state if not exist.
 *
 * We still need this function because sometimes we want to new child init before rendering, and then have parent point to new child.
 *
 * @param idOrState id or state. generate new ID if this is state.
 * @param state the init state. use defaultState if idOrData is id and this is not specified.
 * @returns Thunk<S>
 */
export const init = <S extends State>(
  idOrState?: S | string | null | undefined,
  state?: S,
): Thunk<S> => {
  return (set) => {
    const [argID, argState] = parseArg<S>(idOrState, state)

    const theID = argID || genID()

    set(initCore(theID, argState))
  }
}
