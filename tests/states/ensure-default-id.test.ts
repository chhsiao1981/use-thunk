import { beforeEach, expect, it } from 'vitest'
import type { ModuleState } from '../../src'
import { ensureDefaultID } from '../../src/states'
import { resetThunkContetMap } from '../../src/thunkContext/thunkContextMap'
import { resetID } from '../../src/utils/genID'
import * as ModChild from '../child'

beforeEach(() => {
  resetThunkContetMap()
  resetID()
})

it('ensure default id', () => {
  const moduleState: ModuleState<ModChild.State> = {
    name: ModChild.name,
    nodes: {},
    defaultState: ModChild.defaultState,
  }

  const id0 = ensureDefaultID('test-id0', moduleState)
  expect(id0).toBe('test-id0')
  expect(moduleState.defaultID).toBe('test-id0')

  const id1 = ensureDefaultID('test-id1', moduleState)
  expect(id1).toBe('test-id1')
  expect(moduleState.defaultID).toBe('test-id0')

  const id2 = ensureDefaultID(null, moduleState)
  expect(id2).toBe('test-id0')
  expect(moduleState.defaultID).toBe('test-id0')
})

it('ensure default id-2', () => {
  const moduleState: ModuleState<ModChild.State> = {
    name: ModChild.name,
    nodes: {},
    defaultState: ModChild.defaultState,
  }

  const id0 = ensureDefaultID(null, moduleState)
  expect(id0).toBe('2')
  expect(moduleState.defaultID).toBe('2')

  const id1 = ensureDefaultID('test-id1', moduleState)
  expect(id1).toBe('test-id1')
  expect(moduleState.defaultID).toBe(id0)

  const id2 = ensureDefaultID(null, moduleState)
  expect(id2).toBe(id0)
  expect(moduleState.defaultID).toBe(id0)
})
