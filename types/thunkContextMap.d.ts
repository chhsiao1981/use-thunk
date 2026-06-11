import type { Context as rContext } from 'react';
import type { ModuleState } from './stateTypes';
import type { Context } from './thunkContextTypes';
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
