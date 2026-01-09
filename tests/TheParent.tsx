import { useEffect } from 'react'
import { getNode, getRootID, getState, type ThunkModuleToFunc, useThunk } from '../src'
import TheChild from './TheChild'
import * as DoParent from './theParent'

type TDoParent = ThunkModuleToFunc<typeof DoParent>

export type Props = {
  myID: string
  childID0: string
  childID1: string
}

export default (props: Props) => {
  const { myID, childID0, childID1 } = props

  const [classStateParent, doParent] = useThunk<DoParent.State, TDoParent>(DoParent)

  useEffect(() => {
    doParent.init(myID)
  }, [])

  const theState = getState(classStateParent, myID) || DoParent.defaultState
  const { count } = theState

  const theNode = getNode(classStateParent, myID)

  const rootID = getRootID(classStateParent)

  const rootNode = getNode(classStateParent)

  const root = getState(classStateParent) || DoParent.defaultState

  const onClick = () => {
    doParent.increment(myID)
  }

  const onRemove = () => {
    doParent.remove(myID)
  }

  return (
    <>
      <div className='parent-my-id'>{myID}</div>
      <div className='parent-root-id'>
        {myID}: {rootID}
      </div>
      <div className='parent-count'>
        {myID}: {count}
      </div>
      <div className='parent-node-id'>
        {myID}: {theNode?.id}
      </div>
      <div className='parent-node-count'>
        {myID}: {theNode?.state.count}
      </div>
      <div className='parent-root-node-id'>
        {myID}: {rootNode?.id}
      </div>
      <div className='parent-root-count'>
        {myID}: {root.count}
      </div>
      <button className='parent-button' type='button' onClick={onClick}>
        {myID}: click me
      </button>
      <button className='parent-remove' type='button' onClick={onRemove}>
        {myID}: remove me
      </button>
      <TheChild myID={childID0} />
      <TheChild myID={childID1} />
    </>
  )
}
