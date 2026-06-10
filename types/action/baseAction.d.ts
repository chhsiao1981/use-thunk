export default interface BaseAction {
    myID: string;
    type: string;
    [key: string]: unknown;
}
