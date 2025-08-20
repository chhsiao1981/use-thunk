import type { ClassState, NodeState, State } from './stateTypes';
export declare const getRootNode: <S extends State>(state: ClassState<S>) => NodeState<S> | null;
export declare const getRootID: <S extends State>(state: ClassState<S>) => string;
export declare const getRoot: <S extends State>(state: ClassState<S>) => S | null;
export declare const getNode: <S extends State>(state: ClassState<S>, myID?: string) => NodeState<S> | null;
export declare const getState: <S extends State>(state: ClassState<S>, myID?: string) => S | null;
