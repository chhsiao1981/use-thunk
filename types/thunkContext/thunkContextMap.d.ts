import type { Context as rContext } from 'react';
import type { ModuleState } from '../states';
import type { Context } from './types';
export type ThunkContextMap = {
    theMap: {
        [moduleName: string]: {
            context: rContext<Context<any>>;
            refModuleState: {
                current: ModuleState<any>;
            };
        };
    };
    theList: string[];
};
export declare const THUNK_CONTEXT_MAP: ThunkContextMap;
