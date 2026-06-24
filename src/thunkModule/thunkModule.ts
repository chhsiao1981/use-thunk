import type { BaseActionFunc } from '../action'
import type { State } from '../states'
import type { ThunkFunc } from '../thunk'

// This is used as the parameter for useThunk.
export type ThunkModule<S extends State> = {
  name: string
  defaultState: S

  // The rest of the variables are doModule.
  // Specifying index-signatures to include all the variables.
  [action: string]: ThunkFunc<S> | BaseActionFunc | string | S
}
