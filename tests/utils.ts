export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const arrayN = (n: number) => Array.from({ length: n }, (_, index) => index)
