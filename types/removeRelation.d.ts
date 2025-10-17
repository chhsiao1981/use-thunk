import type { BaseAction, GetClassState } from './action';
import type { Dispatch } from './dispatch';
import type { ClassState, Relation, State } from './stateTypes';
export interface RemoveRelationAction extends BaseAction {
    relationID: string;
    relationClass: string;
}
type RelationRemove = (theDo: DispatchFuncMap) => void;
type RemoveRelationCore = (myID: string, relationID: string, relationClass: string) => BaseAction;
export declare const removeRelation: <S extends State>(dispatch: Dispatch<S>, getClassState: GetClassState<S>, myID: string, relationID: string, relationClass: string, isFromRelation: boolean, relationRemove: RelationRemove, removeRelationCore: RemoveRelationCore, relationName: Relation) => void;
export declare const reduceRemoveRelation: <S extends State>(classState: ClassState<S>, myID: string, relationID: string, relationClass: string, relationName: Relation.LINKS | Relation.CHILDREN) => ClassState<S>;
export {};
