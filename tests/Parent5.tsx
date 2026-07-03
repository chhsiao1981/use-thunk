import { genID, useThunk } from '../src'
import Child from './Child'
import * as ModParent5 from './parent5'

export type Props = {
  myID: string
}

export default (props: Props) => {
  const { myID } = props

  const [parent, doParent] = useThunk<ModParent5.State, typeof ModParent5>(ModParent5, myID)
  const { childID0, childID1, count } = parent

  console.info(
    'Parent (start): myID:',
    myID,
    'childID0:',
    childID0,
    'childID1:',
    childID1,
    'count:',
    count,
  )

  const onClick = () => {
    doParent.increment(myID)
  }

  const onRemove = () => {
    doParent.remove(myID)
  }

  const onResetChildID0 = () => {
    doParent.resetChildID0(myID, genID())
  }

  const onResetChildID1 = () => {
    doParent.resetChildID1(myID, genID())
  }

  return (
    <>
      <div className='parent-my-id'>{myID}</div>
      <div className='parent-count'>
        {myID}: {count}
      </div>
      <div className='parent-childID0'>
        {myID}: {childID0}
      </div>
      <button type='button' className='parent-reset-child0' onClick={onResetChildID0}></button>
      <div className='parent-childID1'>
        {myID}: {childID1}
      </div>
      <button type='button' className='parent-reset-child1' onClick={onResetChildID1}></button>
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
