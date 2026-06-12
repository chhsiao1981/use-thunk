import type { BaseAction } from '../action';
import type { ModuleState, State } from '../states';
export declare const UPSERT = "@chhsiao1981/use-thunk/UPSERT";
export declare const upsert: <S extends State>(myID: string, data: Partial<S>) => BaseAction;
export declare const reduceUpsert: <S extends State>(moduleState: ModuleState<S>, action: BaseAction) => ModuleState<S>;
