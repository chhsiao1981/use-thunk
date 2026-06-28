import { useMemo } from 'react'
import { createReducer } from '../reducer'
import type { ModuleState, State } from '../states'
import { constructDoModule, DO_MODULE_MAP, type ThunkModule, type toDoModule } from '../thunkModule'
import useThunkReducer from './useThunkReducer'

export type UseThunk<S extends State, T extends ThunkModule<S>> = [
  Readonly<ModuleState<S>>,
  toDoModule<T>,
]

/**********
 * useThunk
 **********/
export default <S extends State, T extends ThunkModule<S>>(module: T) => {
  const { name } = module

  const theReducer = useMemo(() => createReducer<S>(), [])

  // 2. useThunkReducer
  const [moduleState, set] = useThunkReducer(theReducer, name)

  if (!DO_MODULE_MAP[name]) {
    constructDoModule(module, set)
  }
  const doModule = DO_MODULE_MAP[name] as toDoModule<T>

  const ret: UseThunk<S, T> = useMemo(() => {
    return [moduleState, doModule]
  }, [moduleState, doModule])

  return ret
}
