/**
 * generate a unique ID. default: crypto.randomUUID()
 *
 * @param myGenID customized genID (ex: uuid.v7)
 * @returns unique ID.
 */
export const genID = (myGenID?: () => string): string => {
  // sequentially numbered id is easy to conflict with DB-id.
  if (myGenID) {
    return myGenID()
  }

  return crypto.randomUUID()
}

/////
// for testing
/////
export const resetID = () => {}
