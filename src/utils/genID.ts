let _GLOBAL_ID = 1

export const genID = (): string => {
  _GLOBAL_ID += 1
  return `${_GLOBAL_ID}`
}
