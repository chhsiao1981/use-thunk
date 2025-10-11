import type { State } from './stateTypes';
import type { ThunkModuleFunc } from './thunk';
import type { DefaultThunkModuleFuncMap } from './thunkModuleFuncMap';
type VoidReturnType<T extends (...params: any[]) => unknown> = (...params: Parameters<T>) => void;
export type DispatchFuncMap<S extends State, T extends ThunkModuleFunc<S>> = {
    [action in keyof T]: VoidReturnType<T[action]>;
} & Omit<DefaultDispatchFuncMap, keyof T>;
export type DefaultDispatchFuncMap = {
    [action in keyof DefaultThunkModuleFuncMap]: VoidReturnType<DefaultThunkModuleFuncMap[action]>;
};
export interface DispatchFuncMapByClassMap<S extends State, T extends ThunkModuleFunc<S>> {
    [className: string]: DispatchFuncMap<S, T>;
}
export interface RefDispatchFuncMapByClassMap<S extends State, T extends ThunkModuleFunc<S>> {
    current: DispatchFuncMapByClassMap<S, T>;
}
export {};
