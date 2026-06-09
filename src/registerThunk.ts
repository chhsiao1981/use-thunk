import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { ClassState, State } from './stateTypes'
import type { ThunkModule } from './thunk'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'

export default <S extends State>(theDo: ThunkModule<S>) => {
  const { myClass, defaultState } = theDo

  if (THUNK_CONTEXT_MAP.theMap[myClass]) {
    // 1. already init
    console.warn('regsterThunk: already init:', myClass)
    return
  }

  // 2. to initialize classState, setClassState, and refClassState.
  const classState: ClassState<S> = {
    myClass,
    nodes: {},
    defaultState,
  }
  const setClassState: Dispatch<SetStateAction<ClassState<S>>> = () => {}
  const refClassState = { current: classState }

  // 3. create context
  const context = createContext({
    refClassState,
    setClassState,
  })

  // 4. setup THUNK_CONTEXT_MAP.theMap.
  THUNK_CONTEXT_MAP.theMap[myClass] = {
    context,
    refClassState,
  }

  // 5. setup THUNK_CONTEXT_MAP.theList, to ensure the rendering order.
  const theList = Object.keys(THUNK_CONTEXT_MAP.theMap)
  theList.sort()
  THUNK_CONTEXT_MAP.theList = theList

  console.info('registerThunk: done:', myClass)
}
