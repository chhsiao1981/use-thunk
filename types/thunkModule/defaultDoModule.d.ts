import type { ActionFunc } from '../action';
export declare const DEFAULT_DO_MODULE: defaultDoModule;
export type defaultDoModule = {
    [action: string]: ActionFunc<any>;
};
