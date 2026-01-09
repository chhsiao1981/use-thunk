import type { Dispatch, SetStateAction } from 'react'
import type { ClassState, State } from './stateTypes'

export type Context<S extends State> = {
  // INFO: we use refClassState to reference across all the useThunk of the same class in different ops.
  refClassState: { current: ClassState<S> }
  setClassState: Dispatch<SetStateAction<ClassState<S>>>
}
