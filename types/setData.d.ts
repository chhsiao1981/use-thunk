import type { BaseAction } from './action';
import type { ClassState, State } from './stateTypes';
export declare const SET_DATA = "@chhsiao1981/use-thunk/SET_DATA";
export declare const setData: <S extends State>(myID: string, data: S) => BaseAction;
export declare const reduceSetData: <S extends State>(classState: ClassState<S>, action: BaseAction) => ClassState<S>;
