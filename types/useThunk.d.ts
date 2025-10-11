import type { DispatchFuncMap } from './dispatchFuncMap';
import type { ClassState, State } from './stateTypes';
import type { ThunkModule, ThunkModuleFunc } from './thunk';
/**********
 * useThunk
 **********/
declare const _default: <S extends State, R extends ThunkModuleFunc<S>>(theDo: ThunkModule<S, R>, init?: (...params: any[]) => S) => [ClassState<S>, DispatchFuncMap<S, R>];
export default _default;
