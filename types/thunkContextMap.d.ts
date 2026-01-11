import type { Context as rContext } from 'react';
import type { ClassState } from './stateTypes';
import type { Context } from './thunkContextTypes';
export type ThunkContextMap = {
    theMap: {
        [classname: string]: {
            context: rContext<Context<any>>;
            refClassState: {
                current: ClassState<any>;
            };
        };
    };
    theList: string[];
};
export declare const THUNK_CONTEXT_MAP: ThunkContextMap;
