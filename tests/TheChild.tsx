import type { DispatchFuncMap, ModuleToFunc } from '../src'
import type * as DoChild from './theChild'

type TDoChild = ModuleToFunc<typeof DoChild>

export type Props = {
  myID: string
  state: DoChild.State
  do: DispatchFuncMap<DoChild.State, TDoChild>
}

export default (props: Props) => {
  const { myID, state, do: doChild } = props

  const count = state.count || 0

  const onClick = () => {
    doChild.increment(myID)
  }

  return (
    <>
      <div className='child-div'>{count}</div>
      <button className='child-button' type='button' onClick={onClick}>
        click me
      </button>
    </>
  )
}
