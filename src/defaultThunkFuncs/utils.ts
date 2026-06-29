export const parseArg = <T>(
  paramsOrID?: T | string | null,
  data?: T,
): [string | null | undefined, T | undefined] => {
  if (typeof paramsOrID === 'string' || paramsOrID === null || typeof paramsOrID === 'undefined') {
    //paramsOrID is id
    return [paramsOrID as string | null | undefined, data]
  }

  //paramsOrID is T
  return [undefined, paramsOrID]
}
