import { expect, it } from 'vitest'

it('test-js-basic', () => {
  expect(null).toBeFalsy()
  expect(undefined).toBeFalsy()
  expect(0).toBeFalsy()
  expect('').toBeFalsy()
  expect({}).not.toBeFalsy()
  expect([]).not.toBeFalsy()
})
