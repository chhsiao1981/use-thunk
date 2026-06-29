import type { BaseAction } from '../action'
import type { ModuleState, State } from '../states'
import { DEFAULT_REDUCE_MAP } from './defaultReduceMap'

export const defaultReducer = <S extends State>(
  moduleState: ModuleState<S>,
  action: BaseAction,
): ModuleState<S> => {
  if (DEFAULT_REDUCE_MAP[action.type]) {
    return DEFAULT_REDUCE_MAP[action.type](moduleState, action)
  }

  return moduleState
}
