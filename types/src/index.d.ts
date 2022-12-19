import { Dispatch as rDispatch, Reducer as rReducer } from 'react';
import { Thunk as rThunk } from './thunk-reducer';
export interface State {
}
export declare type NodeState<S extends State> = {
    id: string;
    state: S;
    _children?: NodeStateRelative | null;
    _parent?: Node<any> | null;
    _links?: NodeStateRelative | null;
};
export declare type StateNodes<S extends State> = {
    [key: string]: NodeState<S>;
};
export declare type ClassState<S extends State> = {
    myClass: string;
    doMe: DispatchedAction<S>;
    root?: string;
    nodes: StateNodes<S>;
};
export declare type Thunk<S extends State> = rThunk<ClassState<S>, Action<S>>;
export declare type Dispatch<S extends State> = rDispatch<Action<S>>;
export declare type Reducer<S extends State> = rReducer<ClassState<S>, Action<S>>;
export interface BaseAction<S extends State> {
    myID: string;
    type: string;
    [key: string]: any;
}
export declare type Action<S extends State> = Thunk<S> | BaseAction<S>;
export declare type DispatchedAction<S extends State> = {
    [key: string]: (...params: any[]) => void;
};
export declare type ActionFunc<S extends State> = (...params: any[]) => Action<S>;
export declare type ReduceFunc<S extends State> = (state: ClassState<S>, action: BaseAction<S>) => ClassState<S>;
export declare type Node<S extends State> = {
    id: string;
    theClass: string;
    do: DispatchedAction<S>;
};
declare type NodeStateRelative = {
    [relativeClass: string]: {
        list: string[];
        do: DispatchedAction<any>;
    };
};
export declare type UseReducerParams<S extends State> = {
    default: Reducer<S>;
    myClass: string;
    [key: string]: ActionFunc<S> | Reducer<S> | string;
};
export declare type GetClassState<S extends State> = () => ClassState<S>;
export declare type InitParams<S extends State> = {
    myID?: string;
    parentID?: string;
    doParent?: DispatchedAction<S>;
    state?: S;
};
/**********
 * useReducer
 **********/
export declare const useReducer: <S extends State>(theDo: UseReducerParams<S>) => [ClassState<S>, DispatchedAction<S>];
/*************
 * Reducer Default Functions
 *************/
/*****
 * init
 *****/
/***
 * init
 * params: myClass
 *         doMe
 *         parentID
 *         doParent
 *         links: [{id, myClass, do}]
 *         ...params
 */
export declare const init: <S extends State>(params: InitParams<S>, myuuidv4?: () => string) => Thunk<S>;
export declare const addChild: <S extends State>(myID: string, child: Node<any>) => BaseAction<S>;
/***
 * addLink
 */
export declare const addLink: <S extends State>(myID: string, link: Node<any>, isFromLink?: boolean) => Thunk<S>;
/*****
 * remove
 *****/
/***
 * remove
 * params: myID
 *         isFromParent
 */
export declare const remove: <S extends State>(myID: string, isFromParent?: boolean) => Thunk<S>;
/***
 * remove-child
 */
export declare const removeChild: <S extends State>(myID: string, childID: string, childClass: string, isFromChild?: boolean) => Thunk<S>;
/***
 * remove-link
 */
export declare const removeLink: <S extends State>(myID: string, linkID: string, linkClass: string, isFromLink?: boolean) => Thunk<S>;
export declare const setData: <S extends State>(myID: string, data: S) => BaseAction<S>;
/*****
 * createReducer
 *****/
export declare type ReduceMap<S extends State> = {
    [key: string]: ReduceFunc<S>;
};
/***
 * createReducer
 * params: reduceMap
 */
export declare const createReducer: <S extends State>(reduceMap?: ReduceMap<S> | undefined) => Reducer<S>;
/***
 * Retrieving state
 ***/
export declare const getRoot: <S extends State>(state: ClassState<S>) => NodeState<S> | null;
export declare const getRootState: <S extends State>(state: ClassState<S>) => S | null;
export declare const getNodeState: <S extends State>(state: ClassState<S>, myID: string) => NodeState<S> | null;
export declare const getState: <S extends State>(state: ClassState<S>, myID: string) => S | null;
export declare const getChildIDs: <S extends State>(me: NodeState<S>, childClass: string) => string[];
export declare const getChildID: <S extends State>(me: NodeState<S>, childClass: string) => string | null;
export declare const getLinkIDs: <S extends State>(me: NodeState<S>, linkClass: string) => string[];
export declare const getLinkID: <S extends State>(me: NodeState<S>, linkClass: string) => string | null;
export declare const _GEN_UUID_STATE: {
    iterate: number;
};
export declare const genUUID: (myuuidv4?: () => string) => string;
export {};
