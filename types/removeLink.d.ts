import type { Thunk } from './action';
import { type RemoveRelationAction } from './removeRelation';
import { type ClassState, type State } from './stateTypes';
/***
 * remove-link
 */
export declare const removeLink: <S extends State>(myID: string, linkID: string, linkClass: string, isFromLink?: boolean) => Thunk<S>;
export declare const REMOVE_LINK = "@chhsiao1981/use-thunk/REMOVE_LINK";
export declare const reduceRemoveLink: <S extends State>(state: ClassState<S>, action: RemoveRelationAction) => ClassState<S>;
