import type { BaseAction } from '../../action';
import type { ModuleState, State } from '../../states';
export interface InitAction<S extends State> extends BaseAction {
    state: S;
}
export declare const INIT = "@chhsiao1981/use-thunk/INIT";
declare const _default: <S extends State>(myID: string, state: S) => InitAction<S>;
export default _default;
export declare const reduceInit: <S extends State>(moduleState: ModuleState<S>, action: BaseAction) => ModuleState<S>;
