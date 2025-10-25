export declare const DEFAULT_THUNK_MODULE_FUNC_MAP: {
    init: <S extends import("./stateTypes").State>(params: import("./init").InitParams<S>, myuuidv4?: () => string) => import("./action").Thunk<S>;
    setData: <S extends import("./stateTypes").State>(myID: string, data: Partial<S>) => import("./action").BaseAction;
    remove: <S extends import("./stateTypes").State>(myID: string, isFromParent?: boolean) => import("./action").Thunk<S>;
    addChild: (myID: string, child: import("./stateTypes").NodeMeta) => import("./addRelation").AddRelationAction;
    removeChild: <S extends import("./stateTypes").State>(myID: string, childID: string, childClass: string, isFromChild?: boolean) => import("./action").Thunk<S>;
    addLink: <S extends import("./stateTypes").State>(myID: string, link: import("./stateTypes").NodeMeta, isFromLink?: boolean) => import("./action").Thunk<S>;
    removeLink: <S extends import("./stateTypes").State>(myID: string, linkID: string, linkClass: string, isFromLink?: boolean) => import("./action").Thunk<S>;
};
export type DefaultThunkModuleFuncMap = typeof DEFAULT_THUNK_MODULE_FUNC_MAP;
