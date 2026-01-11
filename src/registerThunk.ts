import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { ClassState, State } from './stateTypes'
import type { ThunkModule, ThunkModuleFunc } from './thunk'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'

export default <S extends State, R extends ThunkModuleFunc<S>>(theDo: ThunkModule<S, R>) => {
  const { myClass } = theDo

  if (THUNK_CONTEXT_MAP.theMap[myClass]) {
    // already init
    console.info('regsterThunk: already init:', myClass)
    return
  }

  const classState: ClassState<S> = {
    myClass,
    nodes: {},
  }
  const setClassState: Dispatch<SetStateAction<ClassState<S>>> = () => {}
  const refClassState = { current: classState }
  const context = createContext({
    refClassState,
    setClassState,
  })

  THUNK_CONTEXT_MAP.theMap[myClass] = {
    context,
    refClassState,
  }
  const theList = Object.keys(THUNK_CONTEXT_MAP.theMap)
  theList.sort()
  THUNK_CONTEXT_MAP.theList = theList

  console.info('registerThunk: done:', myClass)
}
