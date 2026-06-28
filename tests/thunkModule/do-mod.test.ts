import { expect, it } from 'vitest'
import { constructDoModule, doMod } from '../../src/thunkModule'
import * as ModChild from '../child'

it('construct do module', () => {
  const set = () => {}
  const doChild = constructDoModule<ModChild.State, typeof ModChild>(ModChild, set)
  const doChild2 = doMod<ModChild.State, typeof ModChild>(ModChild.name)
  expect(doChild).toBe(doChild2)
})
