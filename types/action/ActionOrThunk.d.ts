import type { State } from '../stateTypes';
import type BaseAction from './baseAction';
import type { Thunk } from './thunk';
export type ActionOrThunk<S extends State> = BaseAction | Thunk<S>;
