import type { BaseAction, Thunk } from './action';
import { type ClassState, type State } from './stateTypes';
export interface InitParams<S extends State> {
    myID?: string;
    parentID?: string;
    doParent?: DispatchFuncMap;
    parentClass?: string;
    state: S;
}
export declare const init: <S extends State>(params: InitParams<S>, myuuidv4?: () => string) => Thunk<S>;
interface InitAction<S extends State> extends BaseAction {
    parentID?: string;
    doParent?: DispatchFuncMap;
    parentClass?: string;
    state: S;
}
export declare const INIT = "react-reducer-utils/INIT";
export declare const reduceInit: <S extends State>(state: ClassState<S>, action: InitAction<S>) => ClassState<S>;
export {};
