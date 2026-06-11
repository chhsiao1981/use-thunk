import type { ThunkFunc } from '../action';
import type { Reducer } from '../reducer';
import type { State } from '../stateTypes';
export interface doModule<S extends State> {
    [action: string]: ThunkFunc<S>;
}
export type ThunkModule<S extends State> = {
    name: string;
    default?: Reducer<S>;
    defaultState: S;
    [action: string]: ThunkFunc<S> | string | Reducer<S> | S | undefined;
};
export type toDoModule<T extends ThunkModule<any>> = Omit<T, 'name' | 'default' | 'defaultState'>;
