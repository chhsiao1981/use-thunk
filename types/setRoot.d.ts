import type { BaseAction } from './action';
import type { ClassState, State } from './stateTypes';
export declare const SET_ROOT = "@chhsiao1981/use-thunk/SET_ROOT";
export declare const setRoot: (myID: string) => BaseAction;
export declare const reduceSetRoot: <S extends State>(state: ClassState<S>, action: BaseAction) => ClassState<S>;
