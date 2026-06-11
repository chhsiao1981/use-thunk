import type { setMap } from './setMap';
import type { ModuleState, NodeState, State } from './stateTypes';
import type { ThunkModuleFunc } from './thunkModule';
import type { UseThunk } from './useThunk';
export declare const getDefaultID: <S extends State>(moduleState: ModuleState<S>) => string;
export declare const getNode: <S extends State>(moduleState: ModuleState<S>, myID?: string) => NodeState<S> | null;
export declare const getState: <S extends State>(moduleState: ModuleState<S>, myID?: string) => S | null;
export declare const mustGetState: <S extends State>(moduleState: ModuleState<S>, myID?: string) => S;
export declare const mustGetStateByThunk: <S extends State, R extends ThunkModuleFunc<S>>(theUseThunk: UseThunk<S, R>, myID?: string) => [S, setMap<S, R>, string];
