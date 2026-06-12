import type { ModuleState, State } from '../states';
import type { ActionOrThunk } from './ActionOrThunk';
import type BaseAction from './baseAction';
import type { Thunk } from './thunk';
export type { Thunk, ActionOrThunk, BaseAction };
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>;
export type ThunkFunc<S extends State> = (...params: any[]) => Thunk<S>;
export type getModuleState<S extends State> = () => ModuleState<S>;
