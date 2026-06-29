import { expect, it } from 'vitest'
import { getNodeOrNull, type ModuleState } from '../../src'
import * as ModChild from '../child'

it('get node or null', () => {
  const moduleState: ModuleState<ModChild.State> = {
    name: ModChild.name,
    nodes: {},
    defaultState: ModChild.defaultState,
  }

  const node0 = getNodeOrNull(moduleState)
  expect(node0).toBeNull()

  const node1 = getNodeOrNull(moduleState, '1')
  expect(node1).toBeNull()
})
