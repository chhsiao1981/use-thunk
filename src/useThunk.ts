import { useContext } from 'react'
import { contextMap } from './contextMap'
import type { DispatchFuncMap } from './dispatchFuncMap'
import type { ClassState, State } from './stateTypes'
import type { ThunkModule, ThunkModuleFunc } from './thunkTypes'

export type UseThunk<S extends State, R extends ThunkModuleFunc<S>> = [ClassState<S>, DispatchFuncMap<S, R>]

/**********
 * useThunk
 **********/
export default <S extends State, R extends ThunkModuleFunc<S>>(theDo: ThunkModule<S, R>): UseThunk<S, R> => {
  const { myClass } = theDo

  const { context } = contextMap.theMap[myClass]

  const { classState, dispatchMap } = useContext(context)

  return [classState, dispatchMap as DispatchFuncMap<S, R>]
}
