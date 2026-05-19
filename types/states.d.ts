import type { DispatchFuncMap } from './dispatchFuncMap';
import type { ClassState, NodeState, State } from './stateTypes';
import type { ThunkModuleFunc } from './thunk';
import type { UseThunk } from './useThunk';
export declare const getDefaultID: <S extends State>(classState: ClassState<S>) => string;
export declare const getNode: <S extends State>(classState: ClassState<S>, myID?: string) => NodeState<S> | null;
export declare const getState: <S extends State>(classState: ClassState<S>, myID?: string) => S | null;
export declare const getStateOrDefault: <S extends State>(classState: ClassState<S>, myID?: string) => S;
export declare const getStateByThunk: <S extends State, R extends ThunkModuleFunc<S>>(theUseThunk: UseThunk<S, R>, myID?: string) => [S, DispatchFuncMap<S, R>, string];
