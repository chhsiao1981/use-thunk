import type { State } from '../states'

/**
 * get the state of the id. use defaultID if id is not specified.
 */
export type get<S extends State> = (id?: string | null) => S
