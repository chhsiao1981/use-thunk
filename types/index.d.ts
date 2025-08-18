import { type Dispatch as rDispatch, type Reducer as rReducer } from 'react';
import { type ActionOrThunk as rActionOrThunk, type Thunk as rThunk } from './thunk-reducer';
export interface State {
    [key: string]: unknown;
}
export interface BaseAction {
    myID: string;
    type: string;
    [key: string]: unknown;
}
export interface NodeState<S extends State> {
    id: string;
    state: S;
    [Relation.CHILDREN]?: NodeStateRelative | null;
    [PARENT]?: NodeMeta | null;
    [Relation.LINKS]?: NodeStateRelative | null;
}
export interface NodeStateMap<S extends State> {
    [key: string]: NodeState<S>;
}
export interface ClassState<S extends State> {
    myClass: string;
    root?: string | null;
    nodes: NodeStateMap<S>;
}
export type Thunk<S extends State> = rThunk<ClassState<S>, BaseAction>;
export type ActionOrThunk<S extends State> = rActionOrThunk<ClassState<S>, BaseAction>;
export type Dispatch<S extends State> = rDispatch<ActionOrThunk<S>>;
export type Reducer<S extends State> = rReducer<ClassState<S>, BaseAction>;
export type ReducerModule<S extends State, R extends ReducerModuleFunc<S>> = {
    myClass: string;
    default?: Reducer<S>;
    defaultState?: S;
} & R;
export type ModuleToFunc<T> = Omit<T, 'myClass' | 'default' | 'defaultState'>;
interface ReducerModuleFunc<S extends State> {
    [action: string]: ActionFunc<S>;
}
type VoidReturnType<T extends (...params: any[]) => any> = (...params: Parameters<T>) => void;
export type DispatchFuncMap<S extends State, R extends ReducerModuleFunc<S>> = {
    [action in keyof R]: VoidReturnType<R[action]>;
} & Omit<DefaultDispatchFuncMap, keyof R>;
export type DefaultDispatchFuncMap = {
    [action in keyof DefaultReducerModuleFunc]: VoidReturnType<DefaultReducerModuleFunc[action]>;
};
export type ActionFunc<S extends State> = (...params: any[]) => ActionOrThunk<S>;
export type ReduceFunc<S extends State> = (state: ClassState<S>, action: BaseAction) => ClassState<S>;
export type NodeMeta = {
    id: string;
    theClass: string;
    do: DispatchFuncMap;
};
type NodeStateRelative = {
    [relativeClass: string]: {
        list: string[];
        do: DispatchFuncMap;
    };
};
export type GetClassState<S extends State> = () => ClassState<S>;
export interface InitParams<S extends State> {
    myID?: string;
    parentID?: string;
    doParent?: DispatchFuncMap;
    parentClass?: string;
    state: S;
}
export interface AddRelativeAction extends BaseAction {
    relative: NodeMeta;
}
export interface RemoveRelativeAction extends BaseAction {
    relationID: string;
    relationClass: string;
}
declare enum Relation {
    CHILDREN = "_children",
    LINKS = "_links"
}
declare const PARENT = "_parent";
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
export declare const addChild: (myID: string, child: NodeMeta) => AddRelativeAction;
/***
 * addLink
 */
export declare const addLink: <S extends State>(myID: string, link: NodeMeta, isFromLink?: boolean) => Thunk<S>;
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
export declare const setData: <S extends State>(myID: string, data: S) => BaseAction;
/*****
 * createReducer
 *****/
export interface ReduceMap<S extends State> {
    [type: string]: ReduceFunc<S>;
}
/***
 * createReducer
 * params: reduceMap
 */
export declare const createReducer: <S extends State>(reduceMap?: ReduceMap<S>) => Reducer<S>;
/***
 * Retrieving state
 ***/
export declare const getRootNode: <S extends State>(state: ClassState<S>) => NodeState<S> | null;
export declare const getRootID: <S extends State>(state: ClassState<S>) => string;
export declare const getRoot: <S extends State>(state: ClassState<S>) => S | null;
export declare const getNode: <S extends State>(state: ClassState<S>, myID?: string) => NodeState<S> | null;
export declare const getState: <S extends State>(state: ClassState<S>, myID?: string) => S | null;
export declare const getChildIDs: <S extends State>(me: NodeState<S>, childClass: string) => string[];
export declare const getChildID: <S extends State>(me: NodeState<S>, childClass: string) => string;
export declare const getLinkIDs: <S extends State>(me: NodeState<S>, linkClass: string) => string[];
export declare const getLinkID: <S extends State>(me: NodeState<S>, linkClass: string) => string;
export declare const genUUID: (myuuidv4?: () => string) => string;
declare const DEFAULT_REDUCER_MODULE_FUNCS: {
    init: <S extends State>(params: InitParams<S>, myuuidv4?: () => string) => Thunk<S>;
    setData: <S extends State>(myID: string, data: S) => BaseAction;
    remove: <S extends State>(myID: string, isFromParent?: boolean) => Thunk<S>;
    addChild: (myID: string, child: NodeMeta) => AddRelativeAction;
    removeChild: <S extends State>(myID: string, childID: string, childClass: string, isFromChild?: boolean) => Thunk<S>;
    addLink: <S extends State>(myID: string, link: NodeMeta, isFromLink?: boolean) => Thunk<S>;
    removeLink: <S extends State>(myID: string, linkID: string, linkClass: string, isFromLink?: boolean) => Thunk<S>;
};
export type DefaultReducerModuleFunc = typeof DEFAULT_REDUCER_MODULE_FUNCS;
/**********
 * useReducer
 **********/
export declare const useReducer: <S extends State, R extends ReducerModuleFunc<S>>(theDo: ReducerModule<S, R>) => [ClassState<S>, DispatchFuncMap<S, R>];
export {};
