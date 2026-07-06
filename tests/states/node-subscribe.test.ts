import { beforeEach, expect, it } from 'vitest'
import { getMod, registerThunk } from '../../src'
import { subscribe } from '../../src/states/node'
import type { Listener } from '../../src/states/types'
import * as ModChild from '../child'
import { resetThunkModuleMap } from '../utils'

beforeEach(() => {
  resetThunkModuleMap()
})

it('test-subscribe', () => {
  registerThunk(ModChild)
  const listener: Listener = () => {}
  const modChild = getMod<ModChild.State>(ModChild.name)
  subscribe(listener, 'test-id', modChild)
  expect(Object.keys(modChild.subscribes).length).toBe(1)
  expect(modChild.subscribes['test-id'].listeners.length).toBe(1)
})
