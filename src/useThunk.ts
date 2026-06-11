import { useMemo } from 'react'
import { createReducer } from './createReducer'
import { constructSetMap, type setMap, type setMapByModuleMap } from './setMap'
import type { ModuleState, State } from './stateTypes'
import type { ThunkModule, ThunkModuleFunc } from './thunkModule'
import useThunkReducer from './useThunkReducer'

// biome-ignore lint/suspicious/noExplicitAny: SET_MAP_BY_MODULE can by any type
const SET_MAP_BY_MODULE: setMapByModuleMap<any, any> = {}

export type UseThunk<S extends State, R extends ThunkModuleFunc<S>> = [ModuleState<S>, setMap<S, R>]

/**********
 * useThunk
 **********/
export default <S extends State, R extends ThunkModuleFunc<S>>(
  theDo: ThunkModule<S>,
): UseThunk<S, R> => {
  const { name: propsName, myClass } = theDo
  const name = (propsName ? propsName : myClass) || ''

  // 1. It requires shared nodes for the same module to have the same setMap.
  const isFirstTime = !SET_MAP_BY_MODULE[name]
  if (isFirstTime) {
    SET_MAP_BY_MODULE[name] = {}
  }
  const setMap = SET_MAP_BY_MODULE[name] as setMap<S, R>

  // 2. reducer.
  //    theReducer is different for different useThunk,
  //    even within the same module.
  //    However, because theReducer is a pure function by
  //    having ModuleState as the input. It is ok to have
  //    different reducers within the same module.
  const theReducer = useMemo(() => createReducer<S>(), [])

  // 3. useThunkReducer
  const [moduleState, set] = useThunkReducer(theReducer, name)

  const ret: UseThunk<S, R> = useMemo(() => {
    return [moduleState, setMap]
  }, [moduleState, setMap])

  if (!isFirstTime) {
    return ret
  }

  constructSetMap(theDo, set, setMap)

  return ret
}
