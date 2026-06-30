import { expect, it } from 'vitest'
import { parseArg } from '../../src/defaultThunkFuncs/utils'
import type * as ModChild from '../child'

it('parse-arg: id and params', () => {
  const params: ModChild.State = { count: 0 }
  const [argID, argData] = parseArg<ModChild.State>('test-id', params)

  expect(argID).toBe('test-id')

  expect(argData).not.toBeFalsy()
  expect(argData?.count).toBe(0)
})

it('parse-arg: params only', () => {
  const params: ModChild.State = { count: 0 }
  const [argID, argData] = parseArg<ModChild.State>(params)

  expect(argID).toBeUndefined()

  expect(argData).not.toBeFalsy()
  expect(argData).toBeTypeOf('object')
  expect(argData?.count).toBe(0)
})

it('parse-arg: empty', () => {
  const [argID, argData] = parseArg<ModChild.State>()

  expect(argID).toBeUndefined()

  expect(argData).toBeUndefined()
})

it('parse-arg: params-with-no-id', () => {
  const params: ModChild.State = { count: 0 }
  const [argID, argData] = parseArg<ModChild.State>(undefined, params)

  expect(argID).toBeUndefined()

  expect(argData).not.toBeFalsy()
  expect(argData).toBeTypeOf('object')
  expect(argData?.count).toBe(0)
})

it('parse-arg: params-with-null-id', () => {
  const params: ModChild.State = { count: 0 }
  const [argID, argData] = parseArg<ModChild.State>(null, params)

  expect(argID).toBeNull()

  expect(argData).not.toBeFalsy()
  expect(argData).toBeTypeOf('object')
  expect(argData?.count).toBe(0)
})
