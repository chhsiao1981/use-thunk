import { useMemo } from 'react'
import type { ModuleState, State } from '../states'
import { constructDoModule, DO_MODULE_MAP, type ThunkModule, type toDoModule } from '../thunkModule'
import useThunkReducer from './useThunkReducer'

/**
 * type of useThunkModuleState.
 *
 * [moduleState, doModule]
 */
export type UseThunkModuleState<S extends State, T extends ThunkModule<S>> = [
  Readonly<ModuleState<S>>,
  toDoModule<S, T>,
]

/**
 * get moduleState and doModule.
 *
 * @param module
 * @returns [moduleState, doModule]
 */
const useThunkModuleState = <S extends State, T extends ThunkModule<S>>(module: T) => {
  const { name } = module

  // 2. useThunkReducer
  const [moduleState, set] = useThunkReducer<S>(name)

  if (!DO_MODULE_MAP[name]) {
    constructDoModule(module, set)
  }
  const doModule = DO_MODULE_MAP[name] as toDoModule<S, T>

  const ret: UseThunkModuleState<S, T> = useMemo(() => {
    return [moduleState, doModule]
  }, [moduleState, doModule])

  return ret
}

export default useThunkModuleState
