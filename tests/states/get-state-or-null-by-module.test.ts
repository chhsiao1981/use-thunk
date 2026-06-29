import { expect, it } from 'vitest'
import { getStateOrNullByModule, type ModuleState } from '../../src'
import * as ModChild from '../child'

it('get state or null', () => {
  const moduleState: ModuleState<ModChild.State> = {
    name: ModChild.name,
    nodes: {},
    defaultState: ModChild.defaultState,
  }

  const state0 = getStateOrNullByModule(moduleState)
  expect(state0).toBeNull()

  const state1 = getStateOrNullByModule(moduleState, '1')
  expect(state1).toBeNull()
})
