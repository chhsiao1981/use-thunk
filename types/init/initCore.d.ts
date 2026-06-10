import type BaseAction from '../action/baseAction';
import type { ClassState, State } from '../stateTypes';
export interface InitAction<S extends State> extends BaseAction {
    state: S;
}
export declare const INIT = "@chhsiao1981/use-thunk/INIT";
declare const _default: <S extends State>(myID: string, state: S) => InitAction<S>;
export default _default;
export declare const reduceInit: <S extends State>(classState: ClassState<S>, action: BaseAction) => ClassState<S>;
