import type { ClassState, NodeState, State } from './stateTypes';
export declare const getRootID: <S extends State>(classState: ClassState<S>) => string;
export declare const getNode: <S extends State>(classState: ClassState<S>, myID?: string) => NodeState<S> | null;
export declare const getState: <S extends State>(classState: ClassState<S>, myID?: string) => S | null;
