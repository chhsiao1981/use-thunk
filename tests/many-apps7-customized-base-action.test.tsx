import { act, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { genID, getMod, registerThunk, useThunk } from '../src/index'
import { resetThunkModuleMap } from '../src/thunkContext/thunkModuleMap'
import * as ModChild4 from './child4'
import Parent4 from './Parent4'
import * as ModParent from './parent'

let container: HTMLDivElement | null
let root: ReactDOM.Root | null

beforeEach(() => {
  resetThunkModuleMap()

  registerThunk(ModParent)
  registerThunk(ModParent)
  registerThunk(ModChild4)

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

it('many-apps-7 (useThunk)', async () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  // 2. Intercept the environment error bubble up
  const App = () => {
    const [parentID1] = useState(genID)
    const [childID0] = useState(genID)
    const [childID1] = useState(genID)
    const [childID2] = useState(genID)
    const [childID3] = useState(genID)

    const [_7, doParent, parentID0] = useThunk<ModParent.State, typeof ModParent>(ModParent)
    const [_8, doChild4] = useThunk<ModChild4.State, typeof ModChild4>(ModChild4, childID0)

    console.info('many-apps7: parentID0:', parentID0, 'parentID1:', parentID1)

    // init
    useEffect(() => {
      console.log(
        'many-apps7 (init): parentID:',
        parentID0,
        'childID0:',
        childID0,
        'childID3:',
        childID3,
      )

      const modChild4 = getMod<ModChild4.State>(ModChild4.name)

      doChild4.remove2() // remove no-id. defaultID as childID0 or childID3
      doChild4.remove2() // remove no-id. defaultID as childID0 or childID3
      doChild4.remove()
      doChild4.upsert(childID0, {}) // upsert with id and empty count. setting childID0 as default in 1st round.
      doChild4.setDefaultID(childID0)
      doChild4.upsert(modChild4.defaultID, { count: 1 }) // upsert with params only, setting default-id (childID0 and childID4) as count: 1.
      doChild4.upsert(childID1) // upsert with id only. expecting early return.
      doChild4.init(childID1) // init with already default-id.
      doChild4.upsert(childID2, { count: 6 }) // upsert with id and count as 6.
      doChild4.init(childID3) // init with already default-id.
      doChild4.setDefaultID(childID3) // defaultID as childID3 and childID7.
      doChild4.init() // init with newID.
      doChild4.update('non-exist', {}) // update with non-exist id.
      doChild4.update(childID2) // update with no data.
      doChild4.update(modChild4.defaultID, { count: 10 }) // update default-id count = 10. (childID3 and childID7, but childID3 will be replaced later.)
      doChild4.remove2(childID1) // remove with specified id.
      doChild4.update({ count: 5 }) // update no id.
      doChild4.upsert({ count: 5 }) // upsert no id.
    }, [doParent, doChild4])

    return (
      <div>
        <Parent4 myID={parentID0} childID0={childID0} childID1={childID1} />
        <Parent4 myID={parentID1} childID0={childID2} childID1={childID3} />
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

  const childModule = getMod<ModChild4.State>(ModChild4.name)

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
  expect(parentID0).toBe(parentID2)
  expect(parentID0).not.toBe(parentID3)
  expect(parentDefaultID).toBe(parentID0)
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
  expect(childID7).toBe(childDefaultID)
  expect(childCounts[0].textContent).toBe(`${childID0}: 1`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 6`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 1`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 6`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 10`)

  console.info(
    'many-apps2: childModule.nodes:',
    childModule.nodes,
    'childID0:',
    childID0,
    'childID1:',
    childID1,
    'childID3:',
    childID3,
  )

  expect(childModule.nodes[childID0].stateAndIsDefaultID.state.count).toBe(1)
  expect(childModule.nodes[childID1].stateAndIsDefaultID.state.count).toBe(0)
  expect(childModule.nodes[childID2].stateAndIsDefaultID.state.count).toBe(6)
  expect(childModule.nodes[childID3].stateAndIsDefaultID.state.count).toBe(0)
  expect(childModule.nodes[childID4].stateAndIsDefaultID.state.count).toBe(1)
  expect(childModule.nodes[childID5].stateAndIsDefaultID.state.count).toBe(0)
  expect(childModule.nodes[childID6].stateAndIsDefaultID.state.count).toBe(6)
  expect(childModule.nodes[childID7].stateAndIsDefaultID.state.count).toBe(10)

  console.info('many-apps2: to click parent-0 button (1st)')

  act(() => parentButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(consoleSpy).not.toHaveBeenCalled()

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 1`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 1`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 6`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 1`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 6`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 10`)

  console.info('many-apps: to click child-0 button (1st)')
  act(() => childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(consoleSpy).not.toHaveBeenCalled()

  console.info('many-apps: to click child-0 button (2nd)')
  act(() => childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 1`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 3`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 6`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 1`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 6`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 10`)

  console.info('many-apps: to click child-3 button (1st)')
  act(() => childButtons[3].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  console.info('many-apps: to click child-3 button (2nd)')
  act(() => childButtons[3].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  console.info('many-apps: to click child-3 button (3rd)')
  act(() => childButtons[3].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 1`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 3`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 6`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 1`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 6`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 10`)

  console.info('many-apps: to click child-4 button 2 (1st)')
  act(() => childButtons2[4].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps: to click child-4 button 2 (2nd)')
  act(() => childButtons2[4].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps: to click child-4 button 2 (3rd)')
  act(() => childButtons2[4].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 1`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 3`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 6`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 7`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 6`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 10`)

  console.info('many-apps: to click child-5 button 3 (1st)')
  act(() => childButtons3[5].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps: to click child-5 button 3 (2nd)')
  act(() => childButtons3[5].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps: to click child-5 button 3 (3rd)')
  act(() => childButtons3[5].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentDefaultCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 1`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 3`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 6`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 7`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 9`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 6`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 10`)

  console.info('many-apps2: to remove parent-0')
  act(() => parentRemoves[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  const newParentMyIDs = container.querySelectorAll('.parent-my-id')

  const parentDefaultIDs2 = container.querySelectorAll('.parent-default-id')
  const parentDefaultNodeIDs2 = container.querySelectorAll('.parent-default-node-id')

  const newParentID0 = newParentMyIDs[0].textContent
  const newParentID1 = newParentMyIDs[1].textContent
  const newParentID2 = newParentMyIDs[2].textContent
  const newParentID3 = newParentMyIDs[3].textContent

  const parentDefaultID2 = newParentID0

  expect(newParentID0).toBe(newParentID2)
  expect(parentID0).not.toBe(newParentID0)
  expect(parentID1).toBe(newParentID1)
  expect(parentID2).not.toBe(newParentID2)
  expect(parentID3).toBe(newParentID3)

  expect(parentCounts[0].textContent).toBe(`${newParentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${newParentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${newParentID0}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${newParentID2}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 3`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 6`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 7`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 9`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 6`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 10`)

  expect(parentDefaultIDs2[0].textContent).toBe(`${newParentID0}: ${parentDefaultID2}`)
  expect(parentDefaultIDs2[1].textContent).toBe(`${parentID1}: ${parentDefaultID2}`)
  expect(parentDefaultIDs2[2].textContent).toBe(`${newParentID2}: ${parentDefaultID2}`)
  expect(parentDefaultIDs2[3].textContent).toBe(`${parentID3}: ${parentDefaultID2}`)
  expect(parentDefaultNodeIDs2[0].textContent).toBe(`${newParentID0}: ${parentDefaultID2}`)
  expect(parentDefaultNodeIDs2[1].textContent).toBe(`${parentID1}: ${parentDefaultID2}`)
  expect(parentDefaultNodeIDs2[2].textContent).toBe(`${newParentID2}: ${parentDefaultID2}`)
  expect(parentDefaultNodeIDs2[3].textContent).toBe(`${parentID3}: ${parentDefaultID2}`)

  console.info('many-apps2: to remove parent-0 (again)')
  act(() => parentRemoves[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  const newParentMyID2s = container.querySelectorAll('.parent-my-id')
  const parentDefaultIDs3 = container.querySelectorAll('.parent-default-id')
  const parentDefaultNodeIDs3 = container.querySelectorAll('.parent-default-node-id')

  const newParentID02 = newParentMyID2s[0].textContent
  const newParentID12 = newParentMyID2s[1].textContent
  const newParentID22 = newParentMyID2s[2].textContent
  const newParentID32 = newParentMyID2s[3].textContent

  const parentDefaultID3 = newParentID02

  expect(newParentID02).toBe(newParentID22)
  expect(parentID0).not.toBe(newParentID02)
  expect(newParentID0).not.toBe(newParentID02)
  expect(parentID1).toBe(newParentID12)
  expect(parentID2).not.toBe(newParentID22)
  expect(newParentID2).not.toBe(newParentID22)
  expect(parentID3).toBe(newParentID32)

  expect(parentCounts[0].textContent).toBe(`${newParentID02}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${newParentID22}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentDefaultCounts[0].textContent).toBe(`${newParentID02}: 0`)
  expect(parentDefaultCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentDefaultCounts[2].textContent).toBe(`${newParentID22}: 0`)
  expect(parentDefaultCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 3`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 6`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 7`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 9`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 6`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 10`)

  expect(parentDefaultIDs3[0].textContent).toBe(`${newParentID02}: ${parentDefaultID3}`)
  expect(parentDefaultIDs3[1].textContent).toBe(`${parentID1}: ${parentDefaultID3}`)
  expect(parentDefaultIDs3[2].textContent).toBe(`${newParentID22}: ${parentDefaultID3}`)
  expect(parentDefaultIDs3[3].textContent).toBe(`${parentID3}: ${parentDefaultID3}`)
  expect(parentDefaultNodeIDs3[0].textContent).toBe(`${newParentID02}: ${parentDefaultID3}`)
  expect(parentDefaultNodeIDs3[1].textContent).toBe(`${parentID1}: ${parentDefaultID3}`)
  expect(parentDefaultNodeIDs3[2].textContent).toBe(`${newParentID22}: ${parentDefaultID3}`)
  expect(parentDefaultNodeIDs3[3].textContent).toBe(`${parentID3}: ${parentDefaultID3}`)

  expect(consoleSpy).not.toHaveBeenCalled()
})
