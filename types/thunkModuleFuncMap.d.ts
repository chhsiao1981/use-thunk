export declare const DEFAULT_THUNK_MODULE_FUNC_MAP: {
    init: <S extends import("./stateTypes").State>(params: import("./init").InitParams<S>, myuuidv4?: () => string) => import("./action").Thunk<S>;
    setData: <S extends import("./stateTypes").State>(myID: string, data: Partial<S>) => import("./action").BaseAction;
    remove: <S extends import("./stateTypes").State>(myID: string) => import("./action").Thunk<S>;
};
export type DefaultThunkModuleFuncMap = typeof DEFAULT_THUNK_MODULE_FUNC_MAP;
