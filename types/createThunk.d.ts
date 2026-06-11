import type { State } from './stateTypes';
import type { ThunkModule } from './thunkModule';
declare const _default: <S extends State>(theDo: ThunkModule<S>) => void;
export default _default;
export declare const registerThunk: <S extends State>(theDo: ThunkModule<S>) => void;
