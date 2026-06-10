import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { ClassState, State } from './stateTypes'
import { THUNK_CONTEXT_MAP } from './thunkContextMap'
import type { ThunkModule } from './thunkModule'

export default function createThunk<S extends State>(theDo: ThunkModule<S>) {
  const { myClass, defaultState } = theDo

  if (THUNK_CONTEXT_MAP.theMap[myClass]) {
    console.warn('createThunk: already init:', myClass)
    return
  }

  const classState: ClassState<S> = { myClass, nodes: {}, defaultState }
  const setClassState: Dispatch<SetStateAction<ClassState<S>>> = () => {}
  const refClassState = { current: classState }
  const context = createContext({ refClassState, setClassState })

  THUNK_CONTEXT_MAP.theMap[myClass] = { context, refClassState }
  const theList = Object.keys(THUNK_CONTEXT_MAP.theMap).sort()
  THUNK_CONTEXT_MAP.theList = theList

  console.info('createThunk: done:', myClass)
}

export function registerThunk<S extends State>(theDo: ThunkModule<S>) {
  console.warn('registerThunk will be deprecated in the next version.')
  return createThunk(theDo)
}
