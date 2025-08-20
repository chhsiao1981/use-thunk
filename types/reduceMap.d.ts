import type { ReduceFunc } from './reducer';
import type { State } from './stateTypes';
export interface ReduceMap<S extends State> {
    [type: string]: ReduceFunc<S>;
}
export declare const DEFAULT_REDUCE_MAP: <S extends State>() => ReduceMap<S>;
