import type { BaseActionFunc } from '../action'
import type { State } from '../states'
import type { ThunkFunc } from '../thunk'

/**
 * The definition of a thunk module.
 *
 * Required:
 * * `name`: module name. convention: `[npm-package-name]/[module]`.
 * * `defaultState`: default state.
 *
 * The other variables should be thunk functions (ThunFunc).
 */
export type ThunkModule<S extends State> = {
  name: string
  defaultState: S

  // The rest of the variables are doModule.
  // Specifying index-signatures to include all the variables.
  [action: string]: ThunkFunc<S> | BaseActionFunc | string | S
}
