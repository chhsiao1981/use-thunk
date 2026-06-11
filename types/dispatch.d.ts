import type { Dispatch } from 'react';
import type { ActionOrThunk } from './action/ActionOrThunk';
import type { State } from './stateTypes';
export type dispatch<S extends State> = Dispatch<ActionOrThunk<S>>;
