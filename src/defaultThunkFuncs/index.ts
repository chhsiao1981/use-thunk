// default thunks will be used in thunkModule/defaultDoModule and defaultReduceMap
import { INIT, init, reduceInit } from './init'
export { INIT, init, reduceInit }

import { reduceUpdate, UPDATE, update } from './update'
export { reduceUpdate, UPDATE, update }

import { REMOVE, reduceRemove, remove } from './remove'
export { REMOVE, reduceRemove, remove }

import { reduceUpsert, UPSERT, upsert } from './upsert'
export { reduceUpsert, UPSERT, upsert }

import { REFRESH, reduceRefresh, refresh } from './refresh'
export { REFRESH, reduceRefresh, refresh }

import { reduceSetDefaultID, SET_DEFAULT_ID, setDefaultID } from './setDefaultID'
export { reduceSetDefaultID, SET_DEFAULT_ID, setDefaultID }

import { DEFAULT_THUNK_FUNC_MAP, type defaultThunkFuncMap } from './defaultThunkFuncMap'
export { DEFAULT_THUNK_FUNC_MAP, type defaultThunkFuncMap }
