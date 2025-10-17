import { type NodeState, type State } from './stateTypes';
export declare const getChildIDs: <S extends State>(myNode: NodeState<S>, childClass: string) => string[];
export declare const getChildID: <S extends State>(myNode: NodeState<S>, childClass: string) => string;
export declare const getLinkIDs: <S extends State>(myNode: NodeState<S>, linkClass: string) => string[];
export declare const getLinkID: <S extends State>(myNode: NodeState<S>, linkClass: string) => string;
