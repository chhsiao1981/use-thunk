import type { Dispatch } from '../dispatch';
import type { ClassState, State } from '../stateTypes';
export type Thunk<S extends State> = (dispatch: Dispatch<S>, getClassState: () => ClassState<S>) => void;
