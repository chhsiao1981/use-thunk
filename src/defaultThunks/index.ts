// default thunks will be used in thunkModule/defaultDoModule and defaultReduceMap
import { INIT, type InitParams, init, reduceInit } from './init'
export { INIT, type InitParams, init, reduceInit }

import { reduceUpdate, UPDATE, update } from './update'
export { reduceUpdate, UPDATE, update }

import { REMOVE, reduceRemove, remove } from './remove'
export { REMOVE, reduceRemove, remove }

import { reduceUpsert, UPSERT, upsert } from './upsert'
export { UPSERT, upsert, reduceUpsert }

import { reduceSetDefaultID, SET_DEFAULT_ID, setDefaultID } from './setDefaultID'
export { SET_DEFAULT_ID, setDefaultID, reduceSetDefaultID }
