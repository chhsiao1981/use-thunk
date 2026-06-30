import type { Dispatch, SetStateAction } from 'react'
import type { State } from '../states'
import type { RefModuleState } from '../states/types'

export type Context<S extends State> = {
  refModuleState: RefModuleState<S>
  setRefModuleState: Dispatch<SetStateAction<RefModuleState<S>>>
}
