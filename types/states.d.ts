import type { setMap } from './setMap';
import type { ModuleState, NodeState, State } from './stateTypes';
import type { doModule } from './thunkModule';
import type { UseThunk } from './useThunk';
export declare const getDefaultID: <S extends State>(moduleState: ModuleState<S>) => string;
export declare const getNodeOrNull: <S extends State>(moduleState: ModuleState<S>, myID?: string) => Readonly<NodeState<S>> | null;
export declare const getStateOrNullByModule: <S extends State>(moduleState: ModuleState<S>, myID?: string) => Readonly<S> | null;
export declare const getStateByModule: <S extends State>(moduleState: ModuleState<S>, myID?: string) => Readonly<S>;
export declare const getState: <S extends State, R extends doModule<S>>(theUseThunk: UseThunk<S, R>, myID?: string) => [Readonly<S>, setMap<S, R>, string];
