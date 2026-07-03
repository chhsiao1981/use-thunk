import { expect, it } from 'vitest'
import { partialShallowEq, shallowEq } from '../src/utils'

it('test-partial-shallow-eq', () => {
  const a = { 1: 'test' }
  const b = { 1: 'test2' }
  const c = { 1: 'test' }
  expect(partialShallowEq(a, b)).toBe(false)
  expect(partialShallowEq(a, c)).toBe(true)
})

it('test-shallow-eq', () => {
  const a = { 1: 'test' }
  const b = { 1: 'test2' }
  const c = { 1: 'test' }
  expect(shallowEq(a, b)).toBe(false)
  expect(shallowEq(a, c)).toBe(true)
})
