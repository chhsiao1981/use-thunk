let _GLOBAL_ID = 1

/**
 * generate a unique ID.
 *
 * @returns unique ID.
 */
export const genID = (): string => {
  _GLOBAL_ID += 1
  return `${_GLOBAL_ID}`
}

/////
// for testing
/////
export const resetID = () => {
  _GLOBAL_ID = 1
}
