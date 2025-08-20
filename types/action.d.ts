import type { ClassState, State } from './stateTypes';
import type { ActionOrThunk as rActionOrThunk, Thunk as rThunk } from './thunkReducer';
export interface BaseAction {
    myID: string;
    type: string;
    [key: string]: unknown;
}
export type Thunk<S extends State> = rThunk<ClassState<S>, BaseAction>;
export type ActionOrThunk<S extends State> = rActionOrThunk<ClassState<S>, BaseAction>;
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>;
export type GetClassState<S extends State> = () => ClassState<S>;
