import type { DispatchFuncMap, ModuleToFunc } from '../src'
import type * as DoParent from './theParent'

type TDoParent = ModuleToFunc<typeof DoParent>

export type Props = {
  myID: string
  state: DoParent.State
  do: DispatchFuncMap<DoParent.State, TDoParent>
}

export default (props: Props) => {
  const { myID, state, do: doParent } = props

  const count = state?.count || 0

  const onClick = () => {
    console.info('TheParent: onClick: to increment: myID:', myID)
    doParent.increment(myID)
  }

  return (
    <>
      <div className='parent-div'>{count}</div>
      <button className='parent-button' type='button' onClick={onClick}>
        click me
      </button>
    </>
  )
}
