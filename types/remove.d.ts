import type BaseAction from './action/baseAction';
import type { ClassState, State } from './stateTypes';
export declare const REMOVE = "@chhsiao1981/use-thunk/REMOVE";
export declare const remove: (myID: string) => BaseAction;
export declare const reduceRemove: <S extends State>(classState: ClassState<S>, action: BaseAction) => ClassState<S>;
