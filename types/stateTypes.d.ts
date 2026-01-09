export interface State {
    [key: string]: unknown;
}
export type NodeState<S extends State> = {
    id: string;
    state: S;
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
