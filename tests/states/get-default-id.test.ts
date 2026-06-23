import { expect, it } from 'vitest'
import { getDefaultID, type ModuleState } from '../../src'
import * as DoChild from '../child'

it('get default id', () => {
  const moduleState: ModuleState<DoChild.State> = {
    name: DoChild.name,
    nodes: {},
    defaultState: DoChild.defaultState,
  }

  const defaultID0 = getDefaultID(moduleState)
  expect(defaultID0).toBe('')

  const defaultID1 = getDefaultID(moduleState, true)
  expect(defaultID1).not.toBe('')
})
