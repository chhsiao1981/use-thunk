import { expect, it } from 'vitest'
import { constructDoModule } from '../../src/thunkModule'
import * as ModChild from '../child'

it('construct do module', () => {
  const set = () => {}
  const doChild = constructDoModule<ModChild.State, typeof ModChild>(ModChild, set)
  expect(Object.keys(doChild).length).toBe(8)

  const doChild2 = constructDoModule<ModChild.State, typeof ModChild>(ModChild, set)
  expect(Object.keys(doChild2).length).toBe(8)

  expect(doChild).not.toBe(doChild2)
})
