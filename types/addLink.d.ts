import type { Thunk } from './action';
import { type AddRelationAction } from './addRelation';
import { type ClassState, type NodeMeta, type State } from './stateTypes';
export declare const addLink: <S extends State>(myID: string, link: NodeMeta, isFromLink?: boolean) => Thunk<S>;
export declare const ADD_LINK = "@chhsiao1981/use-thunk/ADD_LINK";
export declare const reduceAddLink: <S extends State>(classState: ClassState<S>, action: AddRelationAction) => ClassState<S>;
