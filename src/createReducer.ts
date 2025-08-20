import type { BaseAction } from './action'
import { DEFAULT_REDUCE_MAP, type ReduceMap } from './reduceMap'
import type { Reducer } from './reducer'

import type { ClassState, State } from './stateTypes'

export const createReducer = <S extends State>(reduceMap?: ReduceMap<S>): Reducer<S> => {
  return (state: ClassState<S>, action: BaseAction): ClassState<S> => {
    if (!action) {
      return state
    }

    if (reduceMap?.[action.type]) {
      return reduceMap[action.type](state, action)
    }

    const defaultReduceMap = DEFAULT_REDUCE_MAP<S>()
    if (defaultReduceMap?.[action.type]) {
      return defaultReduceMap[action.type](state, action)
    }

    return state
  }
}
