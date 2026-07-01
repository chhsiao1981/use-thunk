import { useMemo } from 'react'
import type { RefModuleState, State } from '../states'
import { constructDoModule, DO_MODULE_MAP, type ThunkModule, type toDoModule } from '../thunkModule'
import useThunkReducer from './useThunkReducer'

/**
 * type of useThunkRefModuleState.
 *
 * [moduleState, doModule]
 */
export type UseThunkRefModuleState<S extends State, T extends ThunkModule<S>> = [
  Readonly<RefModuleState<S>>,
  toDoModule<S, T>,
]

/**
 * get refModuleState and doModule.
 *
 * @param module
 * @returns [refModuleState, doModule]
 */
const useThunkRefModuleState = <S extends State, T extends ThunkModule<S>>(module: T) => {
  const { name } = module

  // 2. useThunkReducer
  const [refModuleState, set] = useThunkReducer<S>(name)

  if (!DO_MODULE_MAP[name]) {
    constructDoModule(module, set)
  }
  const doModule = DO_MODULE_MAP[name] as toDoModule<S, T>

  const ret: UseThunkRefModuleState<S, T> = useMemo(() => {
    return [refModuleState, doModule]
  }, [refModuleState])

  return ret
}

export default useThunkRefModuleState
