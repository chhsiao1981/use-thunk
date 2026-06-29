import { expect, it } from 'vitest'
import type { ModuleState } from '../../src'
import type { BaseAction } from '../../src/action'
import { defaultReducer } from '../../src/reducer'
import * as ModChild from '../child'

it('create reducer', () => {
  const action: BaseAction = {
    myID: '1',
    type: 'non-exist',
  }

  const moduleState: ModuleState<ModChild.State> = {
    name: ModChild.name,
    nodes: {},
    defaultState: ModChild.defaultState,
  }

  const newModuleState = defaultReducer(moduleState, action)
  expect(newModuleState).toBe(moduleState)
})
