import { useEffect } from 'react'
import { getRootID, getState, type ThunkModuleToFunc, useThunk } from '../src'
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

  const theState = getState(classStateChild, myID) || DoChild.defaultState
  const { count } = theState

  const rootID = getRootID(classStateChild)

  const onClick = () => {
    doChild.increment(myID)
  }

  return (
    <>
      <div className='child-my-id'>{myID}</div>
      <div className='child-root-id'>
        {myID}: {rootID}
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
