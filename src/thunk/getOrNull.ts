import type { State } from '../states'

export type getOrNull<S extends State> = (id?: string) => S | null | undefined
