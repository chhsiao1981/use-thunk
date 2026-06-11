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
export type ModuleState<S extends State> = {
    name: string;
    defaultID?: string | null;
    nodes: NodeStateMap<S>;
    defaultState: S;
};
