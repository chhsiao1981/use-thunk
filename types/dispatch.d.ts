import type { Dispatch } from 'react';
import type { ActionOrThunk } from './action';
import type { State } from './states';
export type dispatch<S extends State> = Dispatch<ActionOrThunk<S>>;
