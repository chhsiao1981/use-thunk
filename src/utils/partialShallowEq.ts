/**
 * partially shallow-eq
 *
 * @param obj1 full object
 * @param obj2 partial
 * @returns
 */

import type { TheObject } from './types'

export const partialShallowEq = <T extends TheObject>(obj1: T, obj2: Partial<T>) => {
  for (const [key, value] of Object.entries(obj2)) {
    if (obj1[key] !== value) {
      return false
    }
  }
  return true
}

export default partialShallowEq
