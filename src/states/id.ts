import { doMod, type ThunkModule } from '../thunkModule'
import { genID } from '../utils'
import type { ModuleState, State } from './types'

export const ensureDefaultID = <S extends State>(
  moduleState: ModuleState<S>,
  id: string,
  isUseThunkOrReduce: boolean,
) => {
  if (moduleState.defaultID) {
    return
  }

  if (isUseThunkOrReduce) {
    // we cannot doMod but need to directly setup defaultID.
    moduleState.defaultID = id
    return
  }

  const doModule = doMod<S, ThunkModule<S>>(moduleState.name)
  doModule._setDefaultID(id)
}

export const ensureID = <S extends State>(
  id: string | null | undefined,
  moduleState: ModuleState<S>,
) => {
  return getID(id, moduleState) || genID()
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
