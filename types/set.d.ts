import type { ActionOrThunk } from './action/ActionOrThunk';
import type { State } from './stateTypes';
export type set<S extends State> = (actionOrID: ActionOrThunk<S> | string, data?: Partial<S>) => void;
