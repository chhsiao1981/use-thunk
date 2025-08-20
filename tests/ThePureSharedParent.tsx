import { getState, type ModuleToFunc, useReducer } from '../src'
import * as DoParent from './theParent'

type TDoParent = ModuleToFunc<typeof DoParent>

export type Props = {
  myID: string
}

export default (props: Props) => {
  const { myID } = props
  const [stateParent, doParent] = useReducer<DoParent.State, TDoParent>(DoParent)
  const state = getState(stateParent, myID) || DoParent.defaultState

  const { count } = state

  const onClick = () => {
    console.info('ThePureSharedParent: onClick: to increment: myID:', myID)
    doParent.increment(myID)
  }

  console.info('ThePureSharedParent: state:', state)

  return (
    <>
      <div className='parent-div'>{count}</div>
      <button className='parent-button' type='button' onClick={onClick}>
        click me
      </button>
    </>
  )
}
