import { useEffect } from 'react'
import { getDefaultID, getNode, getState, type ThunkModuleToFunc, useThunk } from '../src'
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

  const parent = getState(classStateParent, myID) || DoParent.defaultState
  const { count } = parent

  const theNode = getNode(classStateParent, myID)

  const defaultID = getDefaultID(classStateParent)

  const defaultNode = getNode(classStateParent)

  const defaultParent = getState(classStateParent) || DoParent.defaultState

  const onClick = () => {
    doParent.increment(myID)
  }

  const onRemove = () => {
    doParent.remove(myID)
  }

  return (
    <>
      <div className='parent-my-id'>{myID}</div>
      <div className='parent-default-id'>
        {myID}: {defaultID}
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
      <div className='parent-default-node-id'>
        {myID}: {defaultNode?.id}
      </div>
      <div className='parent-default-count'>
        {myID}: {defaultParent.count}
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
