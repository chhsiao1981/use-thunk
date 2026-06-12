import type { State } from './states';
export type get = <S extends State>(id: string) => S;
