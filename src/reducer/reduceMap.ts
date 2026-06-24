import type { State } from '../states'
import type { ReduceFunc } from './reduceFunc'

export interface ReduceMap<S extends State> {
  [type: string]: ReduceFunc<S>
}
