import { getMod, getNodeOrNullByModule, useThunk } from '../src'
import Child3 from './Child3'
import * as ModParent3 from './parent3'

export type Props = {
  myID: string
  childID0: string
  childID1: string
}

export default (props: Props) => {
  const { myID, childID0, childID1 } = props
  const moduleParent3 = getMod<ModParent3.State>(ModParent3.name)

  console.info(
    'Parent3 (start): myID:',
    myID,
    'childID0:',
    childID0,
    'childID1:',
    childID1,
    'defaultID:',
    moduleParent3.defaultID,
  )

  const [parent3, doParent3] = useThunk<ModParent3.State, typeof ModParent3>(ModParent3, myID)
  const [defaultParent, _, defaultID] = useThunk<ModParent3.State, typeof ModParent3>(ModParent3)

  const { count } = parent3

  const theNode = getNodeOrNullByModule(moduleParent3, myID)

  const defaultNode = getNodeOrNullByModule(moduleParent3)

  const defaultParent2 = defaultParent

  const defaultParent3 = defaultParent
  const defaultID3 = moduleParent3.defaultID

  const parent4 = parent3
  const parentID4 = myID

  const parent5 = parent3

  const parent6 = parent3

  const onClick = () => {
    doParent3.increment(myID)
  }

  const onRemove = () => {
    doParent3.remove(myID)
    doParent3.remove('not-exists')
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
        {myID}: {theNode?.stateAndIsDefaultID.state.count}
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
        {myID}: {`${defaultParent === defaultParent3} ${defaultID === defaultID3} true`}
      </div>
      <div className='parent-get-state-by-thunk-2'>
        {myID}:{' '}
        {`${parent3 === parent4} ${myID === parentID4} true ${parent5 === parent4} true ${parent6 === parent4}`}
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
