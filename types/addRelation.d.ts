import type { BaseAction } from './action';
import type { ClassState, NodeMeta, Relation, State } from './stateTypes';
export interface AddRelationAction extends BaseAction {
    relaton: NodeMeta;
}
export declare const reduceAddRelation: <S extends State>(classState: ClassState<S>, action: AddRelationAction, relationName: Relation) => ClassState<S>;
