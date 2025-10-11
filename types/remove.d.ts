import type { BaseAction, Thunk } from './action';
import { type ClassState, type State } from './stateTypes';
export declare const remove: <S extends State>(myID: string, isFromParent?: boolean) => Thunk<S>;
export declare const REMOVE = "@chhsiao1981/use-thunk/REMOVE";
export declare const reduceRemove: <S extends State>(state: ClassState<S>, action: BaseAction) => ClassState<S>;
