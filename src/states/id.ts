import { type CustomGenID, genID } from '../utils'
import type { ModuleState, State } from './types'

export const ensureDefaultID = <S extends State>(
  moduleState: ModuleState<S>,
  id: string,
  origID: string | null | undefined,
) => {
  if (moduleState.defaultID || origID) {
    return
  }

  // we cannot doMod but need to directly setup defaultID.
  moduleState.defaultID = id
  return
}

export const ensureID = <S extends State>(
  id: string | null | undefined,
  moduleState: ModuleState<S>,
  customGenID?: CustomGenID,
) => {
  return getID(id, moduleState) || genID(customGenID)
}

export const getID = <S extends State>(id: string | null | undefined, moduleState: ModuleState<S>) => {
  return id ? id : getDefaultID(moduleState)
}

/**
 * get defaultID
 *
 * @param moduleState module state
 * @returns defaultID
 */
export const getDefaultID = <S extends State>(moduleState: ModuleState<S>) => {
  return moduleState.defaultID
}
