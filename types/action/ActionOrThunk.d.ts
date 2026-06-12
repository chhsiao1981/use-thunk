import type { State } from '../states';
import type BaseAction from './baseAction';
import type { Thunk } from './thunk';
export type ActionOrThunk<S extends State> = BaseAction | Thunk<S>;
