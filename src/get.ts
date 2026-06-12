import type { State } from './states'

export type get<S extends State> = (id?: string) => S
export type getOrNull<S extends State> = (id?: string) => S | null | undefined
