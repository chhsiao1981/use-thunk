import { useEffect } from 'react'
import { getDefaultID, getState, type toDoModule, useThunk } from '../src'
import * as DoChild from './child'

type doChild = toDoModule<typeof DoChild>

export type Props = {
  myID: string
}

export default (props: Props) => {
  const { myID } = props

  const useChild = useThunk<DoChild.State, doChild>(DoChild)
  const [moduleChild, _doChild] = useChild
  const [child, doChild] = getState(useChild, myID)

  useEffect(() => {
    doChild.init(myID)
  }, [])

  const { count } = child

  const defaultID = getDefaultID(moduleChild)

  const onClick = () => {
    doChild.increment(myID)
  }

  return (
    <>
      <div className='child-my-id'>{myID}</div>
      <div className='child-default-id'>
        {myID}: {defaultID}
      </div>
      <div className='child-count' key={`count-${myID}`}>
        {myID}: {count}
      </div>
      <button className='child-button' type='button' onClick={onClick}>
        {myID}: click me
      </button>
    </>
  )
}
