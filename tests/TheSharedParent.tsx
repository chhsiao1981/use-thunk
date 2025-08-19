import { type DispatchFuncMap, getState, type ModuleToFunc, useReducer } from '../src'
import * as DoParent from './theParent'

type TDoParent = ModuleToFunc<typeof DoParent>

export type Props = {
  myID: string
  state: DoParent.State
  do: DispatchFuncMap<DoParent.State, TDoParent>
}

export default (props: Props) => {
  const { myID, state: stateShared, do: doParentShared } = props
  const [stateParent, doParent] = useReducer<DoParent.State, TDoParent>(DoParent)
  const state = getState(stateParent, myID) || DoParent.defaultState

  const { count } = state

  const onClick = () => {
    console.info('TheSharedParent: onClick: to increment: myID:', myID)
    doParent.increment(myID)
    doParentShared.increment(myID)
  }

  const isSame = state === stateShared
  const isSameStr = isSame ? 'true' : 'false'

  console.info('TheSharedParent: state:', state, 'stateShared:', stateShared, 'isSame:', isSame)

  return (
    <>
      <div className='parent-div'>{count}</div>
      <div className='parent-is-same'>{isSameStr}</div>
      <button className='parent-button' type='button' onClick={onClick}>
        click me
      </button>
    </>
  )
}
