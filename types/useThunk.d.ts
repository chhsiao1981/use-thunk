import type { DispatchFuncMap } from './dispatchFuncMap';
import type { ClassState, State } from './stateTypes';
import type { ThunkModule, ThunkModuleFunc } from './thunk';
export type UseThunk<S extends State, R extends ThunkModuleFunc<S>> = [ClassState<S>, DispatchFuncMap<S, R>];
/**********
 * useThunk
 **********/
declare const _default: <S extends State, R extends ThunkModuleFunc<S>>(theDo: ThunkModule<S, R>, init?: (...params: any[]) => S) => UseThunk<S, R>;
export default _default;
