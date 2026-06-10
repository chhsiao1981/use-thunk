import type { ClassState, State } from '../stateTypes';
import type { ActionOrThunk } from './ActionOrThunk';
import type BaseAction from './baseAction';
import type { Thunk } from './thunk';
export type { Thunk, ActionOrThunk, BaseAction };
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>;
export type ThunkFunc<S extends State> = (...params: any[]) => Thunk<S>;
export type GetClassState<S extends State> = () => ClassState<S>;
