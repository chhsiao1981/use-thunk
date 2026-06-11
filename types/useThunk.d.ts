import { type setMap } from './setMap';
import type { ModuleState, State } from './stateTypes';
import type { ThunkModule, ThunkModuleFunc } from './thunkModule';
export type UseThunk<S extends State, R extends ThunkModuleFunc<S>> = [ModuleState<S>, setMap<S, R>];
/**********
 * useThunk
 **********/
declare const _default: <S extends State, R extends ThunkModuleFunc<S>>(theDo: ThunkModule<S>) => UseThunk<S, R>;
export default _default;
