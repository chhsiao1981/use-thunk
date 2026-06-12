import type { ActionOrThunk } from '../action';
import type { State } from '../states';
import { constructSetMap, type DefaultSetMap, type setMap, type setMapByModuleMap } from './setMap';
export { constructSetMap, type DefaultSetMap, type setMap, type setMapByModuleMap };
export type set<S extends State> = (actionOrID: ActionOrThunk<S> | string, data?: Partial<S>) => void;
