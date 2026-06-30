import type { State as _State, Thunk } from '../src'
import { arrayN, sleep } from './utils'

export const name = 'test/child2'

export interface State extends _State {
  count1: number
  count2: number
  count: number
}

export const defaultState: State = {
  count1: 0,
  count2: 0,
  count: 0,
}

export const increment1 = (): Thunk<State> => {
  return (set, get) => {
    const me = get()
    const { count, count1 } = me

    console.info('increment1: count:', count, 'count1:', count1, 'time:', new Date().getMilliseconds())

    set(undefined, { count: count + 1, count1: count1 + 1 })
  }
}

export const increment2 = (): Thunk<State> => {
  return (set, get) => {
    const me = get()
    const { count, count2 } = me

    console.info('increment2: count:', count, 'count2:', count2, 'time:', new Date().getMilliseconds())

    set(undefined, { count: count + 1, count2: count2 + 1 })
  }
}

export const asyncIncrement1 = (n: number, sleepMS: number): Thunk<State> => {
  return async (set) => {
    for (const idx in arrayN(n)) {
      set(increment1())
      console.info(`asyncIncrement1 (${idx}): to sleep: time:`, new Date().getMilliseconds())
      await sleep(sleepMS)
      console.info(`asyncIncrement1: (${idx}): after sleep: time:`, new Date().getMilliseconds())
    }
  }
}

export const asyncIncrement2 = (n: number, sleepMS: number): Thunk<State> => {
  return async (set) => {
    for (const idx in arrayN(n)) {
      set(increment2())
      console.info(`asyncIncrement2 (${idx}): to sleep: time:`, new Date().getMilliseconds())
      await sleep(sleepMS)
      console.info(`asyncIncrement2 (${idx}): after sleep: time:`, new Date().getMilliseconds())
    }
  }
}
