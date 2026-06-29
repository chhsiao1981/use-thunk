import { getDefaultID, getStateOrNullByModule, useThunkModuleState } from '../src'
import * as ModChild from './child'

export type Props = {
  myID: string
}

export default (props: Props) => {
  const { myID } = props

  const useChild = useThunkModuleState<ModChild.State, typeof ModChild>(ModChild)
  const [moduleChild, doChild] = useChild
  const child = getStateOrNullByModule(moduleChild, myID) || moduleChild.defaultState

  const { count } = child

  const defaultID = getDefaultID(moduleChild)

  const onClick = () => {
    doChild.increment(myID)
  }

  const onClick2 = () => {
    doChild.increment2(myID)
  }

  const onClick3 = () => {
    doChild.increment3(myID)
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
      <button className='child-button-2' type='button' onClick={onClick2}>
        {myID}: click me 2
      </button>
      <button className='child-button-3' type='button' onClick={onClick3}>
        {myID}: click me 3
      </button>
    </>
  )
}
