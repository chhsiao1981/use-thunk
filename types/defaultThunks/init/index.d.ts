import type { Thunk } from '../../action';
import type { State } from '../../states';
import { INIT, reduceInit } from './initCore';
export { INIT, reduceInit };
export interface InitParams<S extends State> {
    myID?: string;
    state: S;
}
export declare const init: <S extends State>(params: InitParams<S>) => Thunk<S>;
