import { getDefaultID, getMod, useThunk } from '../src'
import * as ModChild4 from './child4'

export type Props = {
  myID: string
}

export default (props: Props) => {
  const { myID } = props

  const [child4, doChild4] = useThunk<ModChild4.State, typeof ModChild4>(ModChild4, myID)
  const moduleChild4 = getMod<ModChild4.State>(ModChild4.name)

  const { count } = child4

  const defaultID = getDefaultID(moduleChild4)

  console.info('Child: myID:', myID, 'defaultID:', defaultID)

  const onClick = () => {
    doChild4.increment(myID)
  }

  const onClick2 = () => {
    doChild4.increment2(myID)
  }

  const onClick3 = () => {
    doChild4.increment3(myID)
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
