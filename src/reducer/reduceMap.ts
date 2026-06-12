import type { State } from '../states'
import type { ReduceFunc } from './index'

export interface ReduceMap<S extends State> {
  [type: string]: ReduceFunc<S>
}
