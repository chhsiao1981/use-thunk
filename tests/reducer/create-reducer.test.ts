import { expect, it } from 'vitest'
import type { ModuleState } from '../../src'
import type { BaseAction } from '../../src/action'
import { createReducer } from '../../src/reducer'
import * as DoChild from '../child'

it('create reducer', () => {
  const reducer = createReducer()
  const action: BaseAction = {
    myID: '1',
    type: 'non-exist',
  }

  const moduleState: ModuleState<DoChild.State> = {
    name: DoChild.name,
    nodes: {},
    defaultState: DoChild.defaultState,
  }

  const newModuleState = reducer(moduleState, action)
  expect(newModuleState).toBe(moduleState)
})
