import { type setMap } from './setMap';
import type { ModuleState, State } from './stateTypes';
import type { doModule, ThunkModule } from './thunkModule';
export type UseThunk<S extends State, R extends doModule<S>> = [ModuleState<S>, setMap<S, R>];
/**********
 * useThunk
 **********/
declare const _default: <S extends State, R extends doModule<S>>(theDo: ThunkModule<S>) => UseThunk<S, R>;
export default _default;
