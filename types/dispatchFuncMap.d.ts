import type { Dispatch } from './dispatch';
import type { State } from './stateTypes';
import type { ThunkModule, ThunkModuleFunc } from './thunkModule';
import { type DefaultThunkModuleFuncMap } from './thunkModule/defaultThunkModuleFuncMap';
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
export declare const DISPATCH_FUNC_MAP_BY_CLASS_MAP: DispatchFuncMapByClassMap<any, any>;
export declare const constructDispatchMap: <S extends State, T extends ThunkModuleFunc<S>>(theDo: ThunkModule<S>, dispatch: Dispatch<S>, dispatchMap: DispatchFuncMap<S, T>) => DispatchFuncMap<S, T>;
export {};
