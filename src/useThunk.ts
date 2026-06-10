import { useMemo } from 'react'
import { createReducer } from './createReducer'
import { constructSetMap, type setMap, type setMapByClassMap } from './setMap'
import type { ClassState, State } from './stateTypes'
import type { ThunkModule, ThunkModuleFunc } from './thunkModule'
import useThunkReducer from './useThunkReducer'

// biome-ignore lint/suspicious/noExplicitAny: DISPACH_MAP_BY_CLASS can by any type
const SET_MAP_BY_CLASS: setMapByClassMap<any, any> = {}

export type UseThunk<S extends State, R extends ThunkModuleFunc<S>> = [ClassState<S>, setMap<S, R>]

/**********
 * useThunk
 **********/
export default <S extends State, R extends ThunkModuleFunc<S>>(
  theDo: ThunkModule<S>,
): UseThunk<S, R> => {
  const { myClass } = theDo

  // 1. It requires shared nodes for the same class to have the same setMap.
  const isFirstTime = !SET_MAP_BY_CLASS[myClass]
  if (isFirstTime) {
    SET_MAP_BY_CLASS[myClass] = {}
  }
  const setMap = SET_MAP_BY_CLASS[myClass] as setMap<S, R>

  // 2. reducer.
  //    theReducer is different for different reducers,
  //    even within the same class.
  //    However, because theReducer is a pure function by
  //    having ClassState as the input. It is ok to have
  //    different reducers within the same class.
  const theReducer = useMemo(() => createReducer<S>(), [])

  // 3. useThunkReducer
  const [classState, set] = useThunkReducer(theReducer, myClass)

  const ret: UseThunk<S, R> = useMemo(() => {
    return [classState, setMap]
  }, [classState, setMap])

  if (!isFirstTime) {
    return ret
  }

  constructSetMap(theDo, set, setMap)

  return ret
}
