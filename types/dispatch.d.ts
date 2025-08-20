import type { Dispatch as rDispatch } from 'react';
import type { ActionOrThunk } from './action';
import type { State } from './stateTypes';
export type Dispatch<S extends State> = rDispatch<ActionOrThunk<S>>;
