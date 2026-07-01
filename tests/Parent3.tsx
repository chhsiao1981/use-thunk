import {
  getDefaultID,
  getNodeOrNullByModule,
  getStateByModule,
  getStateOrNullByModule,
  useThunkModuleState,
} from '../src'
import { getState } from '../src/states'
import Child3 from './Child3'
import * as ModParent3 from './parent3'

export type Props = {
  myID: string
  childID0: string
  childID1: string
}

export default (props: Props) => {
  const { myID, childID0, childID1 } = props

  console.info('Parent3 (start): myID:', myID, 'childID0:', childID0, 'childID1:', childID1)

  const useParent = useThunkModuleState<ModParent3.State, typeof ModParent3>(ModParent3)
  const [moduleParent] = useParent
  const [parent, doParent] = getState(useParent, myID)

  const { count } = parent

  const theNode = getNodeOrNullByModule(moduleParent, myID)

  const defaultID = getDefaultID(moduleParent)

  const defaultNode = getNodeOrNullByModule(moduleParent)

  const defaultParent = getStateOrNullByModule(moduleParent) || ModParent3.defaultState

  const defaultParent2 = getStateByModule(moduleParent)

  const [defaultParent3, doParent3, defaultID3] = getState(useParent)

  const [parent4, doParent4, parentID4] = getState(useParent, myID)

  const [parent5, doParent5] = getState(useParent, myID)

  const [parent6] = getState(useParent, myID)

  const onClick = () => {
    doParent.increment(myID)
  }

  const onRemove = () => {
    doParent.remove(myID)
    doParent.remove('not-exists')
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
      <Child3 myID={childID0} />
      <Child3 myID={childID1} />
    </>
  )
}
