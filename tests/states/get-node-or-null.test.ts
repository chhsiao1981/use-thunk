import { expect, it } from 'vitest'
import { getNodeOrNull, type ModuleState } from '../../src'
import * as DoChild from '../child'

it('get node or null', () => {
  const moduleState: ModuleState<DoChild.State> = {
    name: DoChild.name,
    nodes: {},
    defaultState: DoChild.defaultState,
  }

  const node0 = getNodeOrNull(moduleState)
  expect(node0).toBeNull()

  const node1 = getNodeOrNull(moduleState, '1')
  expect(node1).toBeNull()
})
