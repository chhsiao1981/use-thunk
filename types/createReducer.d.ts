import { type ReduceMap } from './reduceMap';
import type { Reducer } from './reducer';
import type { State } from './stateTypes';
export declare const createReducer: <S extends State>(reduceMap?: ReduceMap<S>) => Reducer<S>;
