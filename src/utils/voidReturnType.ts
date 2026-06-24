// biome-ignore lint/suspicious/noExplicitAny: unknown requires same type in list, use any for possible different types.
export type VoidReturnType<T extends (...params: any[]) => unknown> = (...params: Parameters<T>) => void
