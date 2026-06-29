import type { State } from '../states'

/**
 * XXX (moduleState) set theID to defaultID if defaultID does not exist.
 *
 * XXX (moduleState): set state as defaultState if state does not exist.
 *
 * get the state of the id. use defaultID if id is not specified.
 */
export type get<S extends State> = (id?: string | null) => S
