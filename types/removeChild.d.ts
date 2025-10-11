import type { Thunk } from './action';
import { type RemoveRelationAction } from './removeRelation';
import { type ClassState, type State } from './stateTypes';
/***
 * remove-child
 */
export declare const removeChild: <S extends State>(myID: string, childID: string, childClass: string, isFromChild?: boolean) => Thunk<S>;
export declare const REMOVE_CHILD = "@chhsiao1981/use-thunk/REMOVE_CHILD";
export declare const reduceRemoveChild: <S extends State>(state: ClassState<S>, action: RemoveRelationAction) => ClassState<S>;
