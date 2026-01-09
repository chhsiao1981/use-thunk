import type { Dispatch, SetStateAction } from 'react';
import type { ClassState, State } from './stateTypes';
export type Context<S extends State> = {
    refClassState: {
        current: ClassState<S>;
    };
    setClassState: Dispatch<SetStateAction<ClassState<S>>>;
};
