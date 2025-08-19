import { useRef, useState } from 'react'
import type { ActionFunc } from './action'
import { createReducer } from './createReducer'
import type { DispatchFuncMap, DispatchFuncMapByClassMap, RefDispatchFuncMapByClassMap } from './dispatchFuncMap'
import type { ReducerModule, ReducerModuleFunc } from './reducer'
import { DEFAULT_REDUCER_MODULE_FUNC_MAP } from './reducerModuleFuncMap'
import { type ClassState, type NodeStateMap, type State, StateType } from './stateTypes'
import useThunkReducer from './thunkReducer'

// @ts-expect-error DISPATCH_MAP_BY_CLASS can be any type
const DISPATCH_MAP_BY_CLASS: DispatchFuncMapByClassMap = {}

/**********
 * useReducer
 **********/
export const useReducer = <S extends State, R extends ReducerModuleFunc<S>>(
  theDo: ReducerModule<S, R>,
  stateType: StateType = StateType.SHARED,
): [ClassState<S>, DispatchFuncMap<S, R>] => {
  const { myClass } = theDo

  // 1. ensure shared state
  if (stateType === StateType.SHARED) {
    if (!DISPATCH_MAP_BY_CLASS[myClass]) {
      DISPATCH_MAP_BY_CLASS[myClass] = {}
    }
  }

  // 2. dispatchMapByClass
  const refDispatchMapByClass: RefDispatchFuncMapByClassMap<S, R> = useRef({})
  const dispatchMapByClass: DispatchFuncMapByClassMap<S, R> =
    stateType === StateType.SHARED ? DISPATCH_MAP_BY_CLASS[myClass] : refDispatchMapByClass.current

  // 3. It requires shared nodes for the same class to have the same dispatchMap.
  // We don't optimize the dispatchMap in this PR.
  const isFirstTime = !dispatchMapByClass[myClass]
  if (isFirstTime) {
    // @ts-expect-error {} is a kind of DispatchFuncMap<S, R>
    dispatchMapByClass[myClass] = {}
  }
  const dispatchMap = dispatchMapByClass[myClass]

  // 4. local nodes
  const nodes: NodeStateMap<S> = {}

  // 5. reducer.
  //    using useState to have theDo.default as optional.
  //    theReducer won't be changed.
  //
  //    theReducer is different for different reducers,
  //    even within the same class.
  //    However, because theReducer is a pure function
  //    having ClassState as the input. It is ok to have
  //    different reducers even within the same class.
  const [theReducer, _] = useState(() => theDo.default ?? createReducer<S>())

  // 6. useThunkReducer
  const [state, dispatch] = useThunkReducer(
    theReducer,
    {
      myClass,
      // @ts-expect-error doMe is a hidden variable for ClassState
      doMe: dispatchMap,
      nodes,
    },
    myClass,
    stateType,
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
  Object.keys(DEFAULT_REDUCER_MODULE_FUNC_MAP).reduce((val, eachAction) => {
    if (val[eachAction]) {
      return val
    }
    // @ts-expect-error DEFAULT_REDUCER_MODULE_FUNCS are all ActionFunc<S>
    const action: ActionFunc<S> = DEFAULT_REDUCER_MODULE_FUNC_MAP[eachAction]

    // @ts-expect-error eachAction is in DispatchFuncMap<S, R>
    // biome-ignore lint/suspicious/noExplicitAny: action parameters can be any types.
    val[eachAction] = (...params: any[]) => dispatch(action(...params))
    return val
  }, dispatchMap)

  return [state, dispatchMap]
}

export const cleanSharedDispatchMap = () => {
  const classNames = Object.keys(DISPATCH_MAP_BY_CLASS)
  classNames.map((each) => delete DISPATCH_MAP_BY_CLASS[each])

  
}
