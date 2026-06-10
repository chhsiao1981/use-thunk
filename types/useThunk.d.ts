import { type setMap } from './setMap';
import type { ClassState, State } from './stateTypes';
import type { ThunkModule, ThunkModuleFunc } from './thunkModule';
export type UseThunk<S extends State, R extends ThunkModuleFunc<S>> = [ClassState<S>, setMap<S, R>];
/**********
 * useThunk
 **********/
declare const _default: <S extends State, R extends ThunkModuleFunc<S>>(theDo: ThunkModule<S>) => UseThunk<S, R>;
export default _default;
