import type BaseAction from './action/baseAction'
import { DEFAULT_REDUCE_MAP, type ReduceMap } from './reduceMap'
import type { Reducer } from './reducer'

import type { ModuleState, State } from './stateTypes'

export const createReducer = <S extends State>(reduceMap?: ReduceMap<S>): Reducer<S> => {
  return (moduleState: ModuleState<S>, action: BaseAction): ModuleState<S> => {
    if (!action) {
      return moduleState
    }

    if (reduceMap?.[action.type]) {
      return reduceMap[action.type](moduleState, action)
    }

    const defaultReduceMap = DEFAULT_REDUCE_MAP<S>()
    if (defaultReduceMap?.[action.type]) {
      return defaultReduceMap[action.type](moduleState, action)
    }

    return moduleState
  }
}
