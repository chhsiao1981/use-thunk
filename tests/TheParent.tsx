import { useEffect } from 'react'
import {
  getDefaultID,
  getNode,
  getState,
  getStateByModule,
  getStateOrNullByModule,
  type ThunkModuleToFunc,
  useThunk,
} from '../src'
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

  const useParent = useThunk<DoParent.State, TDoParent>(DoParent)
  const [moduleStateParent, doParent] = useParent

  useEffect(() => {
    doParent.init(myID)
  }, [])

  const parent = getStateOrNullByModule(moduleStateParent, myID) || DoParent.defaultState
  const { count } = parent

  const theNode = getNode(moduleStateParent, myID)

  const defaultID = getDefaultID(moduleStateParent)

  const defaultNode = getNode(moduleStateParent)

  const defaultParent = getStateOrNullByModule(moduleStateParent) || DoParent.defaultState

  const defaultParent2 = getStateByModule(moduleStateParent)

  const [defaultParent3, doParent3, defaultID3] = getState(useParent)

  const [parent4, doParent4, parentID4] = getState(useParent, myID)

  const [parent5, doParent5] = getState(useParent, myID)

  const [parent6] = getState(useParent, myID)

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
      <div className='parent-get-state-or-default'>
        {myID}: {`${defaultParent === defaultParent2}`}
      </div>
      <div className='parent-get-state-by-thunk'>
        {myID}:{' '}
        {`${defaultParent === defaultParent3} ${defaultID === defaultID3} ${doParent === doParent3}`}
      </div>
      <div className='parent-get-state-by-thunk-2'>
        {myID}:{' '}
        {`${parent === parent4} ${myID === parentID4} ${doParent === doParent4} ${parent5 === parent4} ${doParent5 === doParent4} ${parent6 === parent4}`}
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
