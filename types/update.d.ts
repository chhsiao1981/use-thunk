import type { BaseAction } from './action';
import type { ClassState, State } from './stateTypes';
export declare const UPDATE = "@chhsiao1981/use-thunk/UPDATE";
export declare const update: <S extends State>(myID: string, data: Partial<S>) => BaseAction;
export declare const setData: <S extends State>(myID: string, data: Partial<S>) => BaseAction;
export declare const reduceUpdate: <S extends State>(classState: ClassState<S>, action: BaseAction) => ClassState<S>;
