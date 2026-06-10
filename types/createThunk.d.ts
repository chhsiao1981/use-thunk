import type { State } from './stateTypes';
import type { ThunkModule } from './thunkModule';
export default function createThunk<S extends State>(theDo: ThunkModule<S>): void;
export declare function registerThunk<S extends State>(theDo: ThunkModule<S>): void;
