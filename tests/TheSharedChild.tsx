import { getState, type ModuleToFunc, useReducer } from '../src'
import * as DoChild from './theChild'

type TDoChild = ModuleToFunc<typeof DoChild>

export type Props = {
  myID: string
}

export default (props: Props) => {
  const { myID } = props
  const [stateChild, doChild] = useReducer<DoChild.State, TDoChild>(DoChild)
  const state = getState(stateChild, myID) || DoChild.defaultState

  const { count } = state

  const onClick = () => {
    doChild.increment(myID)
  }

  return (
    <>
      <div className='child-div'>{count}</div>
      <button className='child-button' type='button' onClick={onClick}>
        click me
      </button>
    </>
  )
}
