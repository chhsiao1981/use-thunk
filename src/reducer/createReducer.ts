import type { BaseAction } from '../action'
import type { ModuleState, State } from '../states'
import { DEFAULT_REDUCE_MAP } from './defaultReduceMap'
import type { Reducer } from './reducer'

export const createReducer = <S extends State>(): Reducer<S> => {
  return (moduleState: ModuleState<S>, action: BaseAction): ModuleState<S> => {
    if (!action) {
      return moduleState
    }

    if (DEFAULT_REDUCE_MAP[action.type]) {
      return DEFAULT_REDUCE_MAP[action.type](moduleState, action)
    }

    return moduleState
  }
}
