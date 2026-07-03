import { useMemo } from 'react'
import { ensureID, ensureNode, type State } from '../states'
import { getMod } from '../thunkContext'
import { constructDoModule, DO_MODULE_MAP, type ThunkModule, type toDoModule } from '../thunkModule'
import useThunkReducer from './useThunkReducer'

/**
 * type of useThunk.
 *
 * [state, doModule, id, _defaultState]
 */
export type UseThunk<S extends State, T extends ThunkModule<S>> = [Readonly<S>, toDoModule<S, T>, string]

/**
 * get state of the id, doModule, and the id.
 *
 * use defaultID is id is not provided.
 *
 * @param module
 * @param id
 * @returns [state, doModule, id]
 */
const useThunk = <S extends State, T extends ThunkModule<S>>(module: T, id?: string) => {
  const { name: moduleName } = module

  const moduleState = getMod<S>(moduleName)
  const theID = ensureID(id, moduleState)
  ensureNode(moduleState, theID, true)

  // 2. useThunkReducer as state-based.
  const [stateAndDefaultState, set] = useThunkReducer<S>(moduleName, theID)

  // 3. init doModule.
  if (!DO_MODULE_MAP[moduleName]) {
    constructDoModule(module, set)
  }
  const doModule = DO_MODULE_MAP[moduleName] as toDoModule<S, T>

  // 4. result.
  const ret: UseThunk<S, T> = useMemo(() => {
    return [stateAndDefaultState.state, doModule, theID]
  }, [stateAndDefaultState, theID])

  return ret
}

export default useThunk
