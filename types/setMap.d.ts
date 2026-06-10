import type { set } from './set';
import type { State } from './stateTypes';
import type { ThunkModule, ThunkModuleFunc } from './thunkModule';
import { type DefaultThunkModuleFuncMap } from './thunkModule/defaultThunkModuleFuncMap';
type VoidReturnType<T extends (...params: any[]) => unknown> = (...params: Parameters<T>) => void;
export type setMap<S extends State, T extends ThunkModuleFunc<S>> = {
    [action in keyof T]: VoidReturnType<T[action]>;
} & Omit<DefaultSetMap, keyof T>;
export type DefaultSetMap = {
    [action in keyof DefaultThunkModuleFuncMap]: VoidReturnType<DefaultThunkModuleFuncMap[action]>;
};
export interface setMapByClassMap<S extends State, T extends ThunkModuleFunc<S>> {
    [className: string]: setMap<S, T>;
}
export declare const SET_MAP_BY_CLASS_MAP: setMapByClassMap<any, any>;
export declare const constructSetMap: <S extends State, T extends ThunkModuleFunc<S>>(theDo: ThunkModule<S>, set: set<S>, setMap: setMap<S, T>) => setMap<S, T>;
export {};
