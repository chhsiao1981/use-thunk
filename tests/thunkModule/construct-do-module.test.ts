import { expect, it } from 'vitest'
import { constructDoModule, type toDoModule } from '../../src/thunkModule'
import * as DoChild from '../child'

it('construct do module', () => {
  // @ts-expect-error init doChild
  const doChild: toDoModule<typeof DoChild> = {}
  const set = () => {}
  constructDoModule(DoChild, set, doChild)
  expect(Object.keys(doChild).length).toBe(8)

  constructDoModule(DoChild, set, doChild)
  expect(Object.keys(doChild).length).toBe(8)
})
