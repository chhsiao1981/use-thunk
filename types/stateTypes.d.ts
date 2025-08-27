export declare enum StateType {
    LOCAL = "local"
}
export declare enum Relation {
    CHILDREN = "_children",
    LINKS = "_links"
}
export declare const PARENT = "_parent";
export interface State {
    [key: string]: unknown;
}
export type NodeState<S extends State> = {
    id: string;
    state: S;
    [Relation.CHILDREN]?: NodeStateRelationMap | null;
    [PARENT]?: NodeMeta | null;
    [Relation.LINKS]?: NodeStateRelationMap | null;
};
type NodeStateRelationMap = {
    [relationClass: string]: NodeStateRelation;
};
type NodeStateRelation = {
    list: string[];
    do: DispatchFuncMap;
};
export type NodeStateMap<S extends State> = {
    [key: string]: NodeState<S>;
};
export type NodeStateMapByClass<S extends State> = {
    [className: string]: NodeStateMap<S>;
};
export type ClassState<S extends State> = {
    myClass: string;
    root?: string | null;
    nodes: NodeStateMap<S>;
};
export type NodeMeta = {
    id: string;
    theClass: string;
    do: DispatchFuncMap;
};
export {};
