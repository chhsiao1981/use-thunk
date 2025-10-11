import { useRef, useState } from 'react'
import type { ActionFunc } from './action'
import { createReducer } from './createReducer'
import type { DispatchFuncMap, DispatchFuncMapByClassMap, RefDispatchFuncMapByClassMap } from './dispatchFuncMap'
import type { ClassState, NodeStateMap, State, StateType } from './stateTypes'
import type { ThunkModule, ThunkModuleFunc } from './thunk'
import { DEFAULT_THUNK_MODULE_FUNC_MAP } from './thunkModuleFuncMap'
import useThunkReducer from './thunkReducer'

/**********
 * useThunk
 **********/
export default <S extends State, R extends ThunkModuleFunc<S>>(
  theDo: ThunkModule<S, R>,
  // biome-ignore lint/suspicious/noExplicitAny: params can by any types.
  init?: (...params: any[]) => S,
): [ClassState<S>, DispatchFuncMap<S, R>] => {
  const { myClass } = theDo

  // 1. dispatchMapByClass
  const refDispatchMapByClass: RefDispatchFuncMapByClassMap<S, R> = useRef({})
  const dispatchMapByClass: DispatchFuncMapByClassMap<S, R> = refDispatchMapByClass.current

  // 2. It requires shared nodes for the same class to have the same dispatchMap.
  // We don't optimize the dispatchMap in this PR.
  const isFirstTime = !dispatchMapByClass[myClass]
  if (isFirstTime) {
    // @ts-expect-error {} is a kind of DispatchFuncMap<S, R>
    dispatchMapByClass[myClass] = {}
  }
  const dispatchMap = dispatchMapByClass[myClass]

  // 3. local nodes
  const nodes: NodeStateMap<S> = {}

  // 4. reducer.
  //    using useState to have theDo.default as optional.
  //    theReducer won't be changed.
  //
  //    theReducer is different for different reducers,
  //    even within the same class.
  //    However, because theReducer is a pure function
  //    having ClassState as the input. It is ok to have
  //    different reducers within the same class.
  const [theReducer, _] = useState(() => theDo.default ?? createReducer<S>())

  // 5. useThunkReducer
  const [state, dispatch] = useThunkReducer(
    theReducer,
    {
      myClass,
      // @ts-expect-error doMe is a hidden variable for ClassState
      doMe: dispatchMap,
      nodes,
    },
    init,
  )

  // 7. the dispatchMap is always the same.
  //    we can do early return if not first time.
  if (!isFirstTime) {
    return [state, dispatchMap]
  }

  // 8. setup dispatchMap
  Object.keys(theDo)
    // default and myClass are reserved words.
    // functions starting reduce are included in default and not exported.
    .filter((each) => typeof theDo[each] === 'function')
    .reduce((val, eachAction) => {
      const action: ActionFunc<S> = theDo[eachAction]
      // @ts-expect-error eachAction is in DispatchFuncMap<S, R>
      // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
      val[eachAction] = (...params: any[]) => dispatch(action(...params))
      return val
    }, dispatchMap)

  // 9. default functions for disapatchMap
  Object.keys(DEFAULT_THUNK_MODULE_FUNC_MAP).reduce((val, eachAction) => {
    if (val[eachAction]) {
      return val
    }
    // @ts-expect-error DEFAULT_REDUCER_MODULE_FUNCS are all ActionFunc<S>
    const action: ActionFunc<S> = DEFAULT_THUNK_MODULE_FUNC_MAP[eachAction]

    // @ts-expect-error eachAction is in DispatchFuncMap<S, R>
    // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
    val[eachAction] = (...params: any[]) => dispatch(action(...params))
    return val
  }, dispatchMap)

  return [state, dispatchMap]
}
