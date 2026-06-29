import { useMemo } from 'react'
import { getState, type State } from '../states'
import type { ThunkModule, toDoModule } from '../thunkModule'
import useThunkModuleState from './useThunkModuleState'

export type UseThunk<S extends State, T extends ThunkModule<S>> = [Readonly<S>, toDoModule<T>, string]

/**********
 * useThunkModule
 **********/
export default <S extends State, T extends ThunkModule<S>>(module: T, id?: string) => {
  const useModuleModule = useThunkModuleState<S, T>(module)

  const ret: UseThunk<S, T> = useMemo(() => {
    return getState(useModuleModule, id)
  }, [useModuleModule, id])

  return ret
}
