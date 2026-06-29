/**
 * deepCopy
 *
 * deep copy the object.
 *
 * @param obj
 * @returns cloned obj.
 */
// biome-ignore lint/suspicious/noExplicitAny: obj in deepCopy can be any type.
const deepCopy = (obj: any): any => {
  // Handle primitives, functions, null, or undefined
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item))
  }

  // Handle Objects
  // biome-ignore lint/suspicious/noExplicitAny: clonedObj can be any type.
  const clonedObj: any = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepCopy(obj[key])
    }
  }

  return clonedObj
}

export default deepCopy
