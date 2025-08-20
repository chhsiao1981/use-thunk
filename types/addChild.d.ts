import { type AddRelationAction } from './addRelation';
import { type ClassState, type NodeMeta, type State } from './stateTypes';
export declare const ADD_CHILD = "react-reducer-utils/ADD_CHILD";
export declare const addChild: (myID: string, child: NodeMeta) => AddRelationAction;
export declare const reduceAddChild: <S extends State>(state: ClassState<S>, action: AddRelationAction) => ClassState<S>;
