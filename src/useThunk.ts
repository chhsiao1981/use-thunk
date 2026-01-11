import { useMemo } from 'react'
import { createReducer } from './createReducer'
import {
  constructDispatchMap,
  type DispatchFuncMap,
  type DispatchFuncMapByClassMap,
} from './dispatchFuncMap'
import type { ClassState, State } from './stateTypes'
import type { ThunkModule, ThunkModuleFunc } from './thunk'
import useThunkReducer from './useThunkReducer'

// biome-ignore lint/suspicious/noExplicitAny: DISPACH_MAP_BY_CLASS can by any type
const DISPACH_MAP_BY_CLASS: DispatchFuncMapByClassMap<any, any> = {}

export type UseThunk<S extends State, R extends ThunkModuleFunc<S>> = [
  ClassState<S>,
  DispatchFuncMap<S, R>,
]

/**********
 * useThunk
 **********/
export default <S extends State, R extends ThunkModuleFunc<S>>(
  theDo: ThunkModule<S, R>,
): UseThunk<S, R> => {
  const { myClass } = theDo

  // 1. dispatchMapByClass
  //
  // INFO The reason why we need to useRef is because we don't want to
  //        rebuild dispatchMap every time we call useThunk.
  const dispatchMapByClass: DispatchFuncMapByClassMap<S, R> = DISPACH_MAP_BY_CLASS

  // 2. It requires shared nodes for the same class to have the same dispatchMap.
  // We don't optimize the dispatchMap in this PR.
  const isFirstTime = !dispatchMapByClass[myClass]
  if (isFirstTime) {
    // @ts-expect-error init dispatchMap
    dispatchMapByClass[myClass] = {}
  }
  const dispatchMap = dispatchMapByClass[myClass]

  // 4. reducer.
  //    using useState to have theDo.default as optional.
  //    theReducer won't be changed.
  //
  //    theReducer is different for different reducers,
  //    even within the same class.
  //    However, because theReducer is a pure function
  //    having ClassState as the input. It is ok to have
  //    different reducers within the same class.
  //
  // INFO useMemo is to avoid accidental re-init createReducer every-time.
  const theReducer = useMemo(() => theDo.default ?? createReducer<S>(), [])

  // 5. useThunkReducer
  const [classState, dispatch] = useThunkReducer(theReducer, myClass)

  // INFO useMemo is to avoid accidental included in useEffect.
  const ret: UseThunk<S, R> = useMemo(() => {
    return [classState, dispatchMap]
  }, [classState, dispatchMap])

  if (!isFirstTime) {
    return ret
  }

  constructDispatchMap(theDo, dispatch, dispatchMap)

  return ret
}
