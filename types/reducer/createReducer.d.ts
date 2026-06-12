import type { State } from '../states';
import type { Reducer } from './index';
export declare const createReducer: <S extends State>() => Reducer<S>;
