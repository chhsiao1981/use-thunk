import { useEffect } from 'react'
import { getDefaultID, getState, type ThunkModuleToFunc, useThunk } from '../src'
import * as DoChild from './theChild'

type TDoChild = ThunkModuleToFunc<typeof DoChild>

export type Props = {
  myID: string
}

export default (props: Props) => {
  const { myID } = props

  const [classStateChild, doChild] = useThunk<DoChild.State, TDoChild>(DoChild)

  useEffect(() => {
    doChild.init(myID)
  }, [])

  const child = getState(classStateChild, myID) || DoChild.defaultState
  const { count } = child

  const defaultID = getDefaultID(classStateChild)

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
