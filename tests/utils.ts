import { THUNK_MODULE_MAP } from '../src/thunkModule/thunkModuleMap'

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const arrayN = (n: number) => Array.from({ length: n }, (_, index) => index)

/////
// for testing
/////
export const resetThunkModuleMap = () => {
  Object.assign(THUNK_MODULE_MAP, { theMap: {} })
}
