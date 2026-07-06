import { expect, it } from 'vitest'
import { genID, partialShallowEq, shallowEq } from '../src/utils'

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
it('test-gen-id', () => {
  const myuuid = () => '1'
  const id0 = genID()
  const id1 = genID()
  expect(genID(myuuid)).toBe('1')
  expect(genID(myuuid)).toBe('1')
  expect(id0).not.toBe(id1)
})
