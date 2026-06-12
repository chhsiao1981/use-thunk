import type { dispatch } from '../dispatch';
import type { get, getOrNull } from '../get';
import type { set } from '../set';
import type { ModuleState, State } from '../states';
export type Thunk<S extends State> = (set: set<S>, get: get<S>, getOrNull: getOrNull<S>, dispatch: dispatch<S>, getModuleState: () => ModuleState<S>) => void;
