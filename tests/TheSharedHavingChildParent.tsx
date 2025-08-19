import { getChildIDs, getNode, getState, type ModuleToFunc, useReducer } from '../src'
import Child from './TheSharedChild'
import * as DoChild from './theChild'
import * as DoParent from './theParent'

type TDoParent = ModuleToFunc<typeof DoParent>

export type Props = {
  myID: string
}

export default (props: Props) => {
  const { myID } = props
  const [stateParent, doParent] = useReducer<DoParent.State, TDoParent>(DoParent)
  const state = getState(stateParent, myID) || DoParent.defaultState
  const node = getNode(stateParent, myID)

  const { count } = state

  const onClick = () => {
    console.info('TheSharedHavingChildParent: onClick: to increment: myID:', myID)
    doParent.increment(myID)
  }

  console.info('TheSharedHavingChildParent: state:', state)

  const childIDs = node ? getChildIDs(node, DoChild.myClass) : []

  return (
    <>
      <div className='parent-div'>{count}</div>
      <button className='parent-button' type='button' onClick={onClick}></button>
      {childIDs.map((eachID) => (
        <Child key={eachID} myID={eachID} />
      ))}
    </>
  )
}
