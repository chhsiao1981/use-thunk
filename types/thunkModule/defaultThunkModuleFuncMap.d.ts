import type { ActionFunc } from '../action';
export declare const DEFAULT_THUNK_MODULE_FUNC_MAP: DefaultThunkModuleFuncMap;
export type DefaultThunkModuleFuncMap = {
    [action: string]: ActionFunc<any>;
};
