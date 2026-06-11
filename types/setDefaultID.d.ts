import type BaseAction from './action/baseAction';
import type { ModuleState, State } from './stateTypes';
export declare const SET_DEFAULT_ID = "@chhsiao1981/use-thunk/SET_DEFAULT_ID";
export declare const setDefaultID: (myID: string) => BaseAction;
export declare const reduceSetDefaultID: <S extends State>(moduleState: ModuleState<S>, action: BaseAction) => ModuleState<S>;
