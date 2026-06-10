import type { setMap } from './setMap';
import type { ClassState, NodeState, State } from './stateTypes';
import type { ThunkModuleFunc } from './thunkModule';
import type { UseThunk } from './useThunk';
export declare const getDefaultID: <S extends State>(classState: ClassState<S>) => string;
export declare const getNode: <S extends State>(classState: ClassState<S>, myID?: string) => NodeState<S> | null;
export declare const getState: <S extends State>(classState: ClassState<S>, myID?: string) => S | null;
export declare const mustGetState: <S extends State>(classState: ClassState<S>, myID?: string) => S;
export declare const mustGetStateByThunk: <S extends State, R extends ThunkModuleFunc<S>>(theUseThunk: UseThunk<S, R>, myID?: string) => [S, setMap<S, R>, string];
