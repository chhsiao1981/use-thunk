import type { ThunkFunc } from '../action';
import type { State } from '../states';
import { DEFAULT_DO_MODULE, type defaultDoModule } from './defaultDoModule';
export { DEFAULT_DO_MODULE, type defaultDoModule };
export interface doModule<S extends State> {
    [action: string]: ThunkFunc<S>;
}
export type ThunkModule<S extends State> = {
    name: string;
    defaultState: S;
    [action: string]: ThunkFunc<S> | string | S;
};
export type toDoModule<T extends ThunkModule<any>> = Omit<T, 'name' | 'default' | 'defaultState'>;
