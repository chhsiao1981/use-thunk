import type { TheObject } from './types'

export default <T extends TheObject>(obj1: T, obj2: T) => {
  for (const [key, value] of Object.entries(obj2)) {
    if (obj1[key] !== value) {
      return false
    }
  }

  return true
}
