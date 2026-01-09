import type { BaseAction } from './action';
import type { State } from './stateTypes';
import type { ThunkModule, ThunkModuleFunc } from './thunk';
import { type DefaultThunkModuleFuncMap } from './thunkModuleFuncMap';
import type { Thunk as rThunk } from './useThunkReducer';
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
export declare const constructDispatchMap: <S extends State, T extends ThunkModuleFunc<S>, A extends BaseAction>(theDo: ThunkModule<S, T>, dispatch: (action: A | rThunk<S, A>) => void, dispatchMap: DispatchFuncMap<S, T>) => DispatchFuncMap<S, T>;
export {};
