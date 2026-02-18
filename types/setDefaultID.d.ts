import type { BaseAction } from './action';
import type { ClassState, State } from './stateTypes';
export declare const SET_DEFAULT_ID = "@chhsiao1981/use-thunk/SET_DEFAULT_ID";
export declare const setDefaultID: (myID: string) => BaseAction;
export declare const reduceSetDefaultID: <S extends State>(classState: ClassState<S>, action: BaseAction) => ClassState<S>;
