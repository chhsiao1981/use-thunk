import { act, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { genID, registerThunk, useThunk } from '../src/index'
import { resetThunkModuleMap } from '../src/thunkContext/thunkModuleMap'
import * as ModChild3 from './child3'
import Parent2 from './Parent2'
import * as ModParent from './parent'

let container: HTMLDivElement | null
let root: ReactDOM.Root | null

beforeEach(() => {
  resetThunkModuleMap()

  registerThunk(ModParent)
  registerThunk(ModChild3)

  container = document.createElement('div')
  document.body.appendChild(container)

  root = ReactDOM.createRoot(container)

  // @ts-expect-error set IS_REACT_ACT_ENVIRONMENT
  global.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  root = null
  if (container === null) {
    return
  }

  document.body.removeChild(container)
  container = null
})

it('many-apps5 (init and remove)', async () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  // 2. Intercept the environment error bubble up
  const App = () => {
    const [parentID0] = useState(() => genID())
    const [parentID1] = useState(() => genID())
    const [childID0] = useState(() => genID())
    const [childID1] = useState(() => genID())
    const [childID2] = useState(() => genID())
    const [childID3] = useState(() => genID())
    const [_8, doChild3] = useThunk<ModChild3.State, typeof ModChild3>(ModChild3)

    // init
    useEffect(() => {
      console.log('many-apps5 (init): parentID:', parentID0)
      doChild3.init()
      doChild3.init(childID0)
      doChild3.setDefaultID('')
      doChild3.init(childID0)
      doChild3.init(childID1)
      doChild3.init(childID2)
      doChild3.init(childID3)
      doChild3.init()
      doChild3.update('non-exist', {})
    }, [doChild3])

    return (
      <div>
        <Parent2 myID={parentID0} childID0={childID0} childID1={childID1} />
        <Parent2 myID={parentID1} childID0={childID2} childID1={childID3} />
      </div>
    )
  }

  const App2 = () => {
    return (
      <>
        <App />
        <App />
      </>
    )
  }

  // do act

  act(() => {
    root?.render(<App2 />)
  })

  if (container === null) {
    return
  }

  const parentMyIDs = container.querySelectorAll('.parent-my-id')
  const parentDefaultIDs = container.querySelectorAll('.parent-default-id')
  const parentCounts = container.querySelectorAll('.parent-count')
  const parentButtons = container.querySelectorAll('.parent-button')
  const parentNodeIDs = container.querySelectorAll('.parent-node-id')
  const parentNodeCounts = container.querySelectorAll('.parent-node-count')
  const parentDefaultNodeIDs = container.querySelectorAll('.parent-default-node-id')
  const parentDefaultCounts = container.querySelectorAll('.parent-default-count')
  const parentRemoves = container.querySelectorAll('.parent-remove')
  const parentGetStates = container.querySelectorAll('.parent-get-state-or-default')
  const parentGetStateByThunks = container.querySelectorAll('.parent-get-state-by-thunk')
  const parentGetStateByThunk2s = container.querySelectorAll('.parent-get-state-by-thunk-2')

  const childMyIDs = container.querySelectorAll('.child-my-id')
  const childDefaultIDs = container.querySelectorAll('.child-default-id')
  const childCounts = container.querySelectorAll('.child-count')
  const childButtons = container.querySelectorAll('.child-button')
  const childButtons2 = container.querySelectorAll('.child-button-2')
  const childButtons3 = container.querySelectorAll('.child-button-3')

  expect(parentMyIDs.length).toBe(4)
  expect(parentDefaultIDs.length).toBe(4)
  expect(parentCounts.length).toBe(4)
  expect(parentButtons.length).toBe(4)
  expect(parentNodeIDs.length).toBe(4)
  expect(parentNodeCounts.length).toBe(4)
  expect(parentDefaultNodeIDs.length).toBe(4)
  expect(parentDefaultCounts.length).toBe(4)
  expect(parentRemoves.length).toBe(4)
  expect(parentGetStates.length).toBe(4)
  expect(parentGetStateByThunks.length).toBe(4)
  expect(parentGetStateByThunk2s.length).toBe(4)

  expect(childMyIDs.length).toBe(8)
  expect(childDefaultIDs.length).toBe(8)
  expect(childCounts.length).toBe(8)
  expect(childButtons.length).toBe(8)

  const parentID0 = parentMyIDs[0].textContent
  const parentID1 = parentMyIDs[1].textContent
  const parentID2 = parentMyIDs[2].textContent
  const parentID3 = parentMyIDs[3].textContent

  const childID0 = childMyIDs[0].textContent
  const childID1 = childMyIDs[1].textContent
  const childID2 = childMyIDs[2].textContent
  const childID3 = childMyIDs[3].textContent
  const childID4 = childMyIDs[4].textContent
  const childID5 = childMyIDs[5].textContent
  const childID6 = childMyIDs[6].textContent
  const childID7 = childMyIDs[7].textContent

  const parentDefaultID = parentDefaultIDs[0].textContent.split(': ')[1]
  const childDefaultID = childDefaultIDs[0].textContent.split(': ')[1]

  expect(parentGetStates[0].textContent).toBe(`${parentID0}: true`)
  expect(parentGetStates[1].textContent).toBe(`${parentID1}: true`)
  expect(parentGetStates[2].textContent).toBe(`${parentID2}: true`)
  expect(parentGetStates[3].textContent).toBe(`${parentID3}: true`)

  expect(parentGetStateByThunks[0].textContent).toBe(`${parentID0}: true true true`)
  expect(parentGetStateByThunks[1].textContent).toBe(`${parentID1}: true true true`)
  expect(parentGetStateByThunks[2].textContent).toBe(`${parentID2}: true true true`)
  expect(parentGetStateByThunks[3].textContent).toBe(`${parentID3}: true true true`)

  expect(parentGetStateByThunk2s[0].textContent).toBe(`${parentID0}: true true true true true true`)
  expect(parentGetStateByThunk2s[1].textContent).toBe(`${parentID1}: true true true true true true`)
  expect(parentGetStateByThunk2s[2].textContent).toBe(`${parentID2}: true true true true true true`)
  expect(parentGetStateByThunk2s[3].textContent).toBe(`${parentID3}: true true true true true true`)

  expect(parentDefaultIDs[0].textContent).toBe(`${parentID0}: ${parentDefaultID}`)
  expect(parentDefaultIDs[1].textContent).toBe(`${parentID1}: ${parentDefaultID}`)
  expect(parentDefaultIDs[2].textContent).toBe(`${parentID2}: ${parentDefaultID}`)
  expect(parentDefaultIDs[3].textContent).toBe(`${parentID3}: ${parentDefaultID}`)
  expect(parentDefaultNodeIDs[0].textContent).toBe(`${parentID0}: ${parentDefaultID}`)
  expect(parentDefaultNodeIDs[1].textContent).toBe(`${parentID1}: ${parentDefaultID}`)
  expect(parentDefaultNodeIDs[2].textContent).toBe(`${parentID2}: ${parentDefaultID}`)
  expect(parentDefaultNodeIDs[3].textContent).toBe(`${parentID3}: ${parentDefaultID}`)
  expect(parentID0).not.toBe(parentID1)
  expect(parentID0).not.toBe(parentID2)
  expect(parentID0).not.toBe(parentID3)
  expect(parentDefaultID).not.toBe(parentID0)
  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentButtons[0].textContent).toBe(`${parentID0}: click me`)
  expect(parentButtons[1].textContent).toBe(`${parentID1}: click me`)
  expect(parentButtons[2].textContent).toBe(`${parentID2}: click me`)
  expect(parentButtons[3].textContent).toBe(`${parentID3}: click me`)

  expect(childDefaultIDs[0].textContent).toBe(`${childID0}: ${childDefaultID}`)
  expect(childDefaultIDs[1].textContent).toBe(`${childID1}: ${childDefaultID}`)
  expect(childDefaultIDs[2].textContent).toBe(`${childID2}: ${childDefaultID}`)
  expect(childDefaultIDs[3].textContent).toBe(`${childID3}: ${childDefaultID}`)
  expect(childDefaultIDs[4].textContent).toBe(`${childID4}: ${childDefaultID}`)
  expect(childDefaultIDs[5].textContent).toBe(`${childID5}: ${childDefaultID}`)
  expect(childDefaultIDs[6].textContent).toBe(`${childID6}: ${childDefaultID}`)
  expect(childDefaultIDs[7].textContent).toBe(`${childID7}: ${childDefaultID}`)
  expect(childID0).not.toBe(childID1)
  expect(childID0).not.toBe(childID2)
  expect(childID0).not.toBe(childID3)
  expect(childDefaultID).not.toBe(childID0)
  expect(childDefaultID).not.toBe(childID1)
  expect(childDefaultID).not.toBe(childID2)
  expect(childDefaultID).not.toBe(childID3)
  expect(childDefaultID).not.toBe(childID4)
  expect(childDefaultID).not.toBe(childID5)
  expect(childDefaultID).not.toBe(childID6)
  expect(childDefaultID).not.toBe(childID7)
  expect(childCounts[0].textContent).toBe(`${childID0}: 0`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps4: to click parent-0 button (1st)')

  act(() => parentButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(consoleSpy).not.toHaveBeenCalled()

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 0`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps4: to click child-0 button (1st)')
  act(() => childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(consoleSpy).not.toHaveBeenCalled()

  console.info('many-apps4: to click child-0 button (2nd)')
  act(() => childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps4: to click child-3 button (1st)')
  act(() => childButtons[3].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  console.info('many-apps4: to click child-3 button (2nd)')
  act(() => childButtons[3].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  console.info('many-apps4: to click child-3 button (3rd)')
  act(() => childButtons[3].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps4: to click child-4 button 2 (1st)')
  act(() => childButtons2[4].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps4: to click child-4 button 2 (2nd)')
  act(() => childButtons2[4].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps4: to click child-4 button 2 (3rd)')
  act(() => childButtons2[4].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 6`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps4: to click child-5 button 3 (1st)')
  act(() => childButtons3[5].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps4: to click child-5 button 3 (2nd)')
  act(() => childButtons3[5].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps4: to click child-5 button 3 (3rd)')
  act(() => childButtons3[5].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 6`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 9`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps4: to remove parent-0')
  act(() => parentRemoves[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  const parentDefaultIDs2 = container.querySelectorAll('.parent-default-id')
  const parentDefaultNodeIDs2 = container.querySelectorAll('.parent-default-node-id')
  const parentDefaultID2 = parentDefaultID

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 6`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 9`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  expect(parentDefaultIDs2[0].textContent).toBe(`${parentID0}: ${parentDefaultID2}`)
  expect(parentDefaultIDs2[1].textContent).toBe(`${parentID1}: ${parentDefaultID2}`)
  expect(parentDefaultIDs2[2].textContent).toBe(`${parentID2}: ${parentDefaultID2}`)
  expect(parentDefaultIDs2[3].textContent).toBe(`${parentID3}: ${parentDefaultID2}`)
  expect(parentDefaultNodeIDs2[0].textContent).toBe(`${parentID0}: ${parentDefaultID2}`)
  expect(parentDefaultNodeIDs2[1].textContent).toBe(`${parentID1}: ${parentDefaultID2}`)
  expect(parentDefaultNodeIDs2[2].textContent).toBe(`${parentID2}: ${parentDefaultID2}`)
  expect(parentDefaultNodeIDs2[3].textContent).toBe(`${parentID3}: ${parentDefaultID2}`)

  console.info('many-apps4: to remove parent-0 (again)')
  act(() => parentRemoves[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  const parentDefaultIDs3 = container.querySelectorAll('.parent-default-id')
  const parentDefaultNodeIDs3 = container.querySelectorAll('.parent-default-node-id')
  const parentDefaultID3 = parentDefaultID

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 6`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 9`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  expect(parentDefaultIDs3[0].textContent).toBe(`${parentID0}: ${parentDefaultID3}`)
  expect(parentDefaultIDs3[1].textContent).toBe(`${parentID1}: ${parentDefaultID3}`)
  expect(parentDefaultIDs3[2].textContent).toBe(`${parentID2}: ${parentDefaultID3}`)
  expect(parentDefaultIDs3[3].textContent).toBe(`${parentID3}: ${parentDefaultID3}`)
  expect(parentDefaultNodeIDs3[0].textContent).toBe(`${parentID0}: ${parentDefaultID3}`)
  expect(parentDefaultNodeIDs3[1].textContent).toBe(`${parentID1}: ${parentDefaultID3}`)
  expect(parentDefaultNodeIDs3[2].textContent).toBe(`${parentID2}: ${parentDefaultID3}`)
  expect(parentDefaultNodeIDs3[3].textContent).toBe(`${parentID3}: ${parentDefaultID3}`)

  expect(consoleSpy).not.toHaveBeenCalled()
})
