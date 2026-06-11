import type { Dispatch, SetStateAction } from 'react';
import type { ModuleState, State } from './stateTypes';
export type Context<S extends State> = {
    refModuleState: {
        current: ModuleState<S>;
    };
    setModuleState: Dispatch<SetStateAction<ModuleState<S>>>;
};
