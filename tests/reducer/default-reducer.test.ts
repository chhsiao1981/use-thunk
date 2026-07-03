import { expect, it } from 'vitest'
import type { ModuleState } from '../../src'
import type { BaseAction } from '../../src/action'
import { defaultReducer } from '../../src/reducer'
import * as ModChild from '../child'

it('default-reducer: non-exist action', () => {
  const action: BaseAction = {
    id: '1',
    type: 'non-exist',
  }

  const moduleState: ModuleState<ModChild.State> = {
    name: ModChild.name,
    nodes: {},
    subscribes: {},
    defaultState: ModChild.defaultState,
    isIDBased: false,
  }

  const newModuleState = defaultReducer(moduleState, action)
  expect(newModuleState).toBe(moduleState)
})
