import { ADD_CHILD, reduceAddChild } from './addChild'
import { ADD_LINK, reduceAddLink } from './addLink'
import { INIT, reduceInit } from './init'
import type { ReduceFunc } from './reducer'
import { REMOVE, reduceRemove } from './remove'
import { REMOVE_CHILD, reduceRemoveChild } from './removeChild'
import { REMOVE_LINK, reduceRemoveLink } from './removeLink'
import { reduceSetData, SET_DATA } from './setData'
import { reduceSetRoot, SET_ROOT } from './setRoot'
import type { State } from './stateTypes'

export interface ReduceMap<S extends State> {
  [type: string]: ReduceFunc<S>
}

// default reduceMap
export const DEFAULT_REDUCE_MAP: <S extends State>() => ReduceMap<S> = () => ({
  // @ts-expect-error baseAction in ReduceMap
  [INIT]: reduceInit,
  [SET_DATA]: reduceSetData,
  [REMOVE]: reduceRemove,

  // @ts-expect-error baseAction in ReduceMap
  [ADD_CHILD]: reduceAddChild,
  // @ts-expect-error baseAction in ReduceMap
  [REMOVE_CHILD]: reduceRemoveChild,

  // @ts-expect-error baseAction in ReduceMap
  [ADD_LINK]: reduceAddLink,
  // @ts-expect-error baseAction in ReduceMap
  [REMOVE_LINK]: reduceRemoveLink,

  // setRoot.
  // Typically we don't need this in programming.
  // The root is automatically determined if root is not set.
  [SET_ROOT]: reduceSetRoot,
})
