import type { BaseAction } from '../action';
import type { ModuleState, State } from '../states';
export declare const REMOVE = "@chhsiao1981/use-thunk/REMOVE";
export declare const remove: (myID: string) => BaseAction;
export declare const reduceRemove: <S extends State>(moduleState: ModuleState<S>, action: BaseAction) => ModuleState<S>;
