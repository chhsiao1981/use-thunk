import { v4 as uuidv4 } from 'uuid'

const _GLOBAL_IDS = new Set()

const _GEN_UUID_COUNT = 3

const _GEN_UUID_STATE = {
  iterate: 1,
}

export const genUUID = (myuuidv4?: () => string): string => {
  let theID = ''
  let isAdd = false
  for (let i = 0; i < _GEN_UUID_COUNT; i++) {
    theID = genUUIDCore(myuuidv4)
    if (_GLOBAL_IDS.has(theID)) {
      continue
    }
    _GLOBAL_IDS.add(theID)
    isAdd = true
    break
  }
  if (isAdd) {
    return theID
  }

  _GEN_UUID_STATE.iterate += 1
  theID = genUUIDCore(myuuidv4)
  return theID
}

const genUUIDCore = (myuuid: () => string = uuidv4): string => {
  let theID = ''
  for (let j = 0; j < _GEN_UUID_STATE.iterate; j++) {
    theID += myuuid()
  }
  return theID
}
