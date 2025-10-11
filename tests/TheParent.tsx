import { useEffect } from 'react'
import { type DispatchFuncMap, getRootID, getState, type ThunkModuleToFunc, useThunk } from '../src'
import * as DoParent from './theParent'

type TDoParent = ThunkModuleToFunc<typeof DoParent>

export type Props = {
  myID: string
  state: DoParent.State
  do: DispatchFuncMap<DoParent.State, TDoParent>
}

export default (props: Props) => {
  const { myID, state, do: doParent } = props

  const [stateLocal, doParentLocal] = useThunk<DoParent.State, TDoParent>(DoParent)

  useEffect(() => {
    doParentLocal.init()
  }, [])

  const { count } = state

  const localRootID = getRootID(stateLocal)
  const localState = getState(stateLocal)
  const localStateReal = localState || DoParent.defaultState
  const { count: localCount } = localStateReal

  const onClick = () => {
    console.info('TheParent: onClick: to increment: myID:', myID)
    doParent.increment(myID)
    doParentLocal.increment(localRootID)
    //doParentLocal.increment(myID)
  }

  const isSame = state === localState
  const isSameStr = isSame ? 'true' : 'false'

  console.info('TheParent: state:', state, 'localRootID:', localRootID, 'localState:', localState, 'isSame:', isSame)

  return (
    <>
      <div className='parent-div'>{count}</div>
      <div className='parent-local-root-id'>{localRootID}</div>
      <div className='parent-local-count'>{localCount}</div>
      <div className='parent-is-same'>{isSameStr}</div>
      <button className='parent-button' type='button' onClick={onClick}>
        click me
      </button>
    </>
  )
}
