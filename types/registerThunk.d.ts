import createThunk from './createThunk';
/**
 * Register a thunk module. Deprecated: use `createThunk` instead.
 * @deprecated Use `createThunk` instead. Will be removed in a future version.
 */
declare const _default: <S = any>(theDo: Parameters<typeof createThunk>[0]) => void;
export default _default;
