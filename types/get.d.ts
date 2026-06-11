import type { State } from './stateTypes';
export type get = <S extends State>(id: string) => S;
