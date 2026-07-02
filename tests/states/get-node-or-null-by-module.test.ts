import { expect, it } from 'vitest'
import { getNodeOrNullByModule, type ModuleState } from '../../src'
import * as ModChild from '../child'

it('get node or null', () => {
  const moduleState: ModuleState<ModChild.State> = {
    name: ModChild.name,
    nodes: {},
    defaultState: ModChild.defaultState,
    subscribes: {},
    isIDBased: false,
  }

  const node0 = getNodeOrNullByModule(moduleState)
  expect(node0).toBeNull()

  const node1 = getNodeOrNullByModule(moduleState, '1')
  expect(node1).toBeNull()
})
