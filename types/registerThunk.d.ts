import type { State } from './stateTypes';
import type { ThunkModule, ThunkModuleFunc } from './thunk';
declare const _default: <S extends State, R extends ThunkModuleFunc<S>>(theDo: ThunkModule<S, R>) => void;
export default _default;
