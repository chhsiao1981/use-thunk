import { useMemo } from 'react'
import { ensureID, ensureNode, type State } from '../states'
import {
  constructDoModule,
  DO_MODULE_MAP,
  getMod,
  type ThunkModule,
  type toDoModule,
} from '../thunkModule'
import type { CustomGenID } from '../utils'
import useThunkReducer from './useThunkReducer'

/**
 * type of useThunk.
 *
 * [state, doModule, id]
 */
export type UseThunk<S extends State, T extends ThunkModule<S>> = [Readonly<S>, toDoModule<S, T>, string]

/**
 * get state of the id, doModule, and the id.
 *
 * use ensured defaultID if id is not provided.
 *
 * @param module
 * @param id
 * @param customGenID customized gen-id (used if id is falsy)
 * @returns [state, doModule, id]
 */
const useThunk = <S extends State, T extends ThunkModule<S>>(
  module: T,
  id?: string,
  customGenID?: CustomGenID,
) => {
  const { name: moduleName } = module

  const moduleState = getMod<S>(moduleName)
  const theID = ensureID(id, moduleState, customGenID)
  ensureNode(moduleState, theID, true, id)

  // 2. useThunkReducer as state-based.
  const [stateAndIsDefaultID, set] = useThunkReducer<S>(moduleName, theID)

  // 3. init doModule.
  if (!DO_MODULE_MAP[moduleName]) {
    constructDoModule(module, set)
  }
  const doModule = DO_MODULE_MAP[moduleName] as toDoModule<S, T>

  // 4. result.
  const ret: UseThunk<S, T> = useMemo(() => {
    return [stateAndIsDefaultID.state, doModule, theID]
  }, [stateAndIsDefaultID, theID])

  return ret
}

export default useThunk
