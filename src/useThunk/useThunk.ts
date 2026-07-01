import { useMemo } from 'react'
import { getState, type State } from '../states'
import type { ThunkModule, toDoModule } from '../thunkModule'
import useThunkRefModuleState from './useThunkRefModuleState'

/**
 * type of useThunk.
 *
 * [state, doModule, id]
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
  const [refModuleState, doModule] = useThunkRefModuleState<S, T>(module)

  const ret: UseThunk<S, T> = useMemo(() => {
    return getState([refModuleState.current, doModule], id)
  }, [refModuleState, id])

  return ret
}

export default useThunk
