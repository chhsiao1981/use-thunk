import type { BaseAction } from '../action';
import type { ModuleState, State } from '../states';
export declare const UPDATE = "@chhsiao1981/use-thunk/UPDATE";
export declare const update: <S extends State>(myID: string, data: Partial<S>) => BaseAction;
export declare const reduceUpdate: <S extends State>(moduleState: ModuleState<S>, action: BaseAction) => ModuleState<S>;
