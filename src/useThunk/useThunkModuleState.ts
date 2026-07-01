import { useMemo } from 'react'
import type { ModuleState, State } from '../states'
import type { ThunkModule, toDoModule } from '../thunkModule'
import useThunkRefModuleState from './useThunkRefModuleState'

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
 * @returns [refModuleState, doModule]
 */
const useThunkModuleState = <S extends State, T extends ThunkModule<S>>(module: T) => {
  const [refModuleState, doModule] = useThunkRefModuleState<S, T>(module)

  const ret: UseThunkModuleState<S, T> = useMemo(() => {
    return [refModuleState.current, doModule]
  }, [refModuleState])

  return ret
}

export default useThunkModuleState
