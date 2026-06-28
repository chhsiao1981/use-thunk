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

  // 1. It requires shared nodes for the same module to have the same setMap.
  const isFirstTime = !DO_MODULE_MAP[name]
  if (isFirstTime) {
    DO_MODULE_MAP[name] = {}
  }
  const doModule = DO_MODULE_MAP[name] as toDoModule<T>

  // 2. reducer.
  //    theReducer is different for different useThunk,
  //    even within the same module.
  //    However, because theReducer is a pure function by
  //    having ModuleState as the input. It is ok to have
  //    different reducers within the same module.
  const theReducer = useMemo(() => createReducer<S>(), [])

  // 3. useThunkReducer
  const [moduleState, set] = useThunkReducer(theReducer, name)

  const ret: UseThunk<S, T> = useMemo(() => {
    return [moduleState, doModule]
  }, [moduleState, doModule])

  if (!isFirstTime) {
    return ret
  }

  constructDoModule(module, set, doModule)

  return ret
}
