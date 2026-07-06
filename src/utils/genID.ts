export type CustomGenID = () => string

// XXX _GLOBAL_ID is for test

/**
 * generate a unique ID. default: crypto.randomUUID()
 *
 * @param customGenID customized genID (ex: uuid.v7)
 * @returns unique ID.
 */
export const genID = (customGenID?: () => string): string => {
  // sequentially numbered id is easy to conflict with DB-id.
  if (customGenID) {
    return customGenID()
  }

  return crypto.randomUUID()
}
