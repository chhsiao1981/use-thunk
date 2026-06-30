import { expect, it } from 'vitest'
import { getDefaultID, type ModuleState } from '../../src'
import * as ModChild from '../child'

it('get default id', () => {
  const moduleState: ModuleState<ModChild.State> = {
    name: ModChild.name,
    nodes: {},
    defaultState: ModChild.defaultState,
  }

  const defaultID0 = getDefaultID(moduleState)
  expect(defaultID0).toBeUndefined()
})
