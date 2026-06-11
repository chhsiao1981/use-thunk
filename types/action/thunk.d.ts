import type { set } from '../set';
import type { ModuleState, State } from '../stateTypes';
export type Thunk<S extends State> = (set: set<S>, getModuleState: () => ModuleState<S>) => void;
