import type { BaseAction } from './action'
import { DEFAULT_REDUCE_MAP, type ReduceMap } from './reduceMap'
import type { Reducer } from './reducer'

import type { ClassState, State } from './stateTypes'

export const createReducer = <S extends State>(reduceMap?: ReduceMap<S>): Reducer<S> => {
  return (classState: ClassState<S>, action: BaseAction): ClassState<S> => {
    if (!action) {
      return classState
    }

    if (reduceMap?.[action.type]) {
      return reduceMap[action.type](classState, action)
    }

    const defaultReduceMap = DEFAULT_REDUCE_MAP<S>()
    if (defaultReduceMap?.[action.type]) {
      return defaultReduceMap[action.type](classState, action)
    }

    return classState
  }
}
