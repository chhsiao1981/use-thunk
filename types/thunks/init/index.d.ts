import type { Thunk } from '../../action';
import type { State } from '../../stateTypes';
export interface InitParams<S extends State> {
    myID?: string;
    state: S;
}
export declare const init: <S extends State>(params: InitParams<S>, myuuidv4?: () => string) => Thunk<S>;
