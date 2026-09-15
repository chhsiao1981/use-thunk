import type { State } from "../states";
import type { ActionOrThunk } from "./ActionOrThunk";
import type BaseAction from "./baseAction";

export type { ActionOrThunk, BaseAction };

// ActionFunc
export type ActionFunc<S extends State> = (
  // biome-ignore lint/suspicious/noExplicitAny: params can be any type.
  ...params: any[]
) => ActionOrThunk<S>;

// biome-ignore lint/suspicious/noExplicitAny: params can be any type.
export type BaseActionFunc = (...params: any[]) => BaseAction;
