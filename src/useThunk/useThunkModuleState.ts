import { useMemo } from 'react'
import type { ModuleState, State } from '../states'
import { constructDoModule, DO_MODULE_MAP, type ThunkModule, type toDoModule } from '../thunkModule'
import useThunkReducer from './useThunkReducer'

export type UseThunkModuleState<S extends State, T extends ThunkModule<S>> = [
  Readonly<ModuleState<S>>,
  toDoModule<T>,
]

/**********
 * useThunkModuleState
 **********/
export default <S extends State, T extends ThunkModule<S>>(module: T) => {
  const { name } = module

  // 2. useThunkReducer
  const [moduleState, set] = useThunkReducer<S>(name)

  if (!DO_MODULE_MAP[name]) {
    constructDoModule(module, set)
  }
  const doModule = DO_MODULE_MAP[name] as toDoModule<T>

  const ret: UseThunkModuleState<S, T> = useMemo(() => {
    return [moduleState, doModule]
  }, [moduleState, doModule])

  return ret
}
