// BaseAction contains only object-based actions, no thunk-based actions.
export default interface BaseAction {
  myID: string
  type: string
  [key: string]: unknown
}
