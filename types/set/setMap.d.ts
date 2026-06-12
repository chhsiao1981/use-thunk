import type { set } from '../set';
import type { State } from '../states';
import type { doModule, ThunkModule } from '../thunkModule';
import { type defaultDoModule } from '../thunkModule';
type VoidReturnType<T extends (...params: any[]) => unknown> = (...params: Parameters<T>) => void;
export type setMap<S extends State, T extends doModule<S>> = {
    [action in keyof T]: VoidReturnType<T[action]>;
} & Omit<DefaultSetMap, keyof T>;
export type DefaultSetMap = {
    [action in keyof defaultDoModule]: VoidReturnType<defaultDoModule[action]>;
};
export interface setMapByModuleMap<S extends State, T extends doModule<S>> {
    [moduleMap: string]: setMap<S, T>;
}
export declare const constructSetMap: <S extends State, T extends doModule<S>>(theDo: ThunkModule<S>, set: set<S>, setMap: setMap<S, T>) => setMap<S, T>;
export {};
