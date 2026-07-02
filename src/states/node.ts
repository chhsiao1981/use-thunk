import { deepCopy, shallowEq } from '../utils'
import { getStateOrNullByModule } from './getStateOrNullByModule'
import { ensureDefaultID } from './id'
import type { Listener, ModuleState, NodeState, State } from './types'

const getSnapshot = <S extends State>(moduleState: ModuleState<S>, id: string) => {
  return moduleState.nodes[id]?.stateAndDefaultState
}

export const subscribe = <S extends State>(
  listener: Listener,
  id: string,
  moduleState: ModuleState<S>,
) => {
  if (!moduleState.subscribes[id]) {
    moduleState.subscribes[id] = newSubscribe(id, moduleState)
  }

  moduleState.subscribes[id].listeners.push(listener)

  return () => {
    const subscribe = moduleState.subscribes[id]

    const beforeListenerLength = subscribe.listeners.length
    subscribe.listeners = subscribe.listeners.filter((each) => each !== listener)
    const afterListenerLength = subscribe.listeners.length

    if (beforeListenerLength !== afterListenerLength && afterListenerLength === 0) {
      // recycled and no more listeners.
      delete moduleState.subscribes[id]
    }
  }
}

const emitChange = (listeners: Listener[]) => {
  // biome-ignore lint/suspicious/useIterableCallbackReturn: return void
  listeners.map((each) => {
    each()
  })
}

const newSubscribe = <S extends State>(id: string, moduleState: ModuleState<S>) => {
  if (moduleState.subscribes[id]) {
    return moduleState.subscribes[id]
  }

  return {
    listeners: [] as Listener[],
    subscribe: (listener: Listener) => subscribe(listener, id, moduleState),
    // node can be null because of remove.
    getSnapshot: () => getSnapshot<S>(moduleState, id),
    // node can be null because of remove.
    emitChange: (listeners: Listener[]) => emitChange(listeners),
  }
}

const newNode = <S extends State>(id: string, state: S, moduleState: ModuleState<S>): NodeState<S> => {
  const node = moduleState.nodes[id]
  if (node && shallowEq(node.stateAndDefaultState.state, state)) {
    return node
  }

  const defaultState =
    id === moduleState.defaultID ? state : (getStateOrNullByModule(moduleState) as S | null)

  moduleState.subscribes[id] = newSubscribe(id, moduleState)

  return {
    id,
    stateAndDefaultState: { state, defaultState },
  }
}

export const setNewNode = <S extends State>(
  id: string,
  newState: S,
  moduleState: ModuleState<S>,
  isUseThunk: boolean,
) => {
  const origNode = moduleState.nodes[id]
  const origSubscribe = moduleState.subscribes[id]

  const node = newNode(id, newState, moduleState)
  if (origNode === node) {
    return
  }
  moduleState.nodes[id] = node

  if (isUseThunk || !origSubscribe) {
    return
  }

  origSubscribe.emitChange(origSubscribe.listeners)
}

/**
 * ensureNode is used only by useThunk and getStateByModule
 *
 * @param moduleState
 * @param id
 * @param isUseThunk
 * @returns
 */
export const ensureNode = <S extends State>(
  moduleState: ModuleState<S>,
  id: string,
  isUseThunk: boolean,
) => {
  ensureDefaultID(moduleState, id, isUseThunk)

  if (moduleState.nodes[id]) {
    return
  }

  const newState = deepCopy(moduleState.defaultState)
  setNewNode(id, newState, moduleState, isUseThunk)
}
