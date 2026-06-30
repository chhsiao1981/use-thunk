import { useMemo } from 'react'
import { getState, type State } from '../states'
import type { ThunkModule, toDoModule } from '../thunkModule'
import useThunkModuleState from './useThunkModuleState'

/**
 * type of useThunk.
 *
 * [state, doModule, id]
 */
export type UseThunk<S extends State, T extends ThunkModule<S>> = [Readonly<S>, toDoModule<S, T>, string]

/**
 * XXX (moduleState) set theID to defaultID if defaultID does not exist.
 *
 * XXX (moduleState): set state as defaultState if state does not exist.
 *
 * get state of the id, doModule, and id.
 *
 * use defaultID is id is not provided.
 *
 * @param module
 * @param id
 * @returns [state, doModule, id]
 */
const useThunk = <S extends State, T extends ThunkModule<S>>(module: T, id?: string) => {
  const useModuleModule = useThunkModuleState<S, T>(module)

  const ret: UseThunk<S, T> = useMemo(() => {
    return getState(useModuleModule, id)
  }, [useModuleModule, id])

  return ret
}

export default useThunk
