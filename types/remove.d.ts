import type { BaseAction, Thunk } from './action';
import type { ClassState, State } from './stateTypes';
export declare const remove: <S extends State>(myID: string) => Thunk<S>;
export declare const REMOVE = "@chhsiao1981/use-thunk/REMOVE";
export declare const reduceRemove: <S extends State>(classState: ClassState<S>, action: BaseAction) => ClassState<S>;
