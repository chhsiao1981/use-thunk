import type { State as _State, Thunk } from '../src'
import initCore from '../src/defaultThunkFuncs/init/initCore'
import { removeCore } from '../src/defaultThunkFuncs/remove'
import { updateCore } from '../src/defaultThunkFuncs/update'
import { upsertCore } from '../src/defaultThunkFuncs/upsert'
import { parseArg } from '../src/defaultThunkFuncs/utils'
import { getID } from '../src/states'

export const name = 'test/child4'

export interface State extends _State {
  count: number
}

export const defaultState: State = Object.freeze({
  count: 0,
})

export const init = <S extends State>(
  idOrState?: S | string | null | undefined,
  state?: S,
): Thunk<S> => {
  return (set) => {
    const [argID, argState] = parseArg<S>(idOrState, state)

    set(initCore(argID as string, argState))
  }
}

export const update = <S extends State>(
  idOrData?: Partial<S> | string | null | undefined,
  data?: Partial<S>,
): Thunk<S> => {
  return (set) => {
    const [argID, argData] = parseArg<Partial<S>>(idOrData, data)
    if (!argData) {
      return
    }

    set(updateCore(argID as string, argData))
  }
}

export const upsert = <S extends State>(
  idOrData?: Partial<S> | string | null | undefined,
  data?: Partial<S>,
): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    const [argID, argData] = parseArg<Partial<S>>(idOrData, data)
    console.info(
      'child4.upsert: start: module:',
      getModuleState().name,
      'argID:',
      argID,
      'defaultID:',
      getModuleState().defaultID,
      'argID:',
      argID,
    )

    if (!argData) {
      return
    }

    set(upsertCore(argID as string, argData))
  }
}

export const remove2 = <S extends State>(id?: string | null): Thunk<S> => {
  return (set, _get, _getOrNull, _dispatch, getModuleState) => {
    const theID = getID(id, getModuleState())
    console.info(
      'child4.remove2: start: module:',
      getModuleState().name,
      'id:',
      id,
      'defaultID:',
      getModuleState().defaultID,
      'theID:',
      theID,
    )

    set(removeCore(id as string))
  }
}

export const _setDefaultID = <S extends State>(id?: string | null): Thunk<S> => {
  console.info('child4._setDefaultID: id:', id)
  return () => {}
}

export const increment = (myID: string, num = 1): Thunk<State> => {
  return (set, get) => {
    const me = get(myID)
    const { count } = me

    set(myID, { count: count + num })
    const me2 = get(myID)
    if (me2 === me) {
      console.error('increment: me2 === me (copy-on-write)')
    }

    // set with no-data.
    set(myID)
    const me3 = get(myID)
    if (me2 !== me3) {
      console.error('increment: me2 !== me3')
    }
  }
}

export const increment2 = (myID: string): Thunk<State> => {
  return (set, get) => {
    const me = get(myID)

    const { count } = me

    set(update<State>(myID, { count: count + 2 }))
  }
}

export const increment3 = (myID: string): Thunk<State> => {
  return (set) => {
    set(increment(myID, 3))
  }
}
