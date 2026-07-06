import { getMod, getNodeOrNullByModule, useThunk } from '../src'
import Child from './Child'
import * as ModParent from './parent'

export type Props = {
  myID: string
  childID0: string
  childID1: string
}

export default (props: Props) => {
  const { myID, childID0, childID1 } = props

  console.info('Parent (start): myID:', myID, 'childID0:', childID0, 'childID1:', childID1)

  const [parent, doParent] = useThunk<ModParent.State, typeof ModParent>(ModParent, myID)
  const [defaultParent, _, defaultID] = useThunk<ModParent.State, typeof ModParent>(ModParent)

  const moduleParent = getMod<ModParent.State>(ModParent.name)

  const { count } = parent

  const theNode = getNodeOrNullByModule(moduleParent, myID)

  const defaultNode = getNodeOrNullByModule(moduleParent)

  const defaultParent2 = defaultParent

  const defaultParent3 = defaultParent
  const defaultID3 = moduleParent.defaultID

  const parent4 = parent
  const parentID4 = myID

  const parent5 = parent

  const parent6 = parent

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
        {`${parent === parent4} ${myID === parentID4} true ${parent5 === parent4} true ${parent6 === parent4}`}
      </div>
      <button className='parent-button' type='button' onClick={onClick}>
        {myID}: click me
      </button>
      <button className='parent-remove' type='button' onClick={onRemove}>
        {myID}: remove me
      </button>
      <Child myID={childID0} />
      <Child myID={childID1} />
    </>
  )
}
