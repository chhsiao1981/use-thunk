import { act, StrictMode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { genID, getMod, registerThunk, useThunk } from '../src/index'
import * as ModChild from './child'
import Parent from './Parent'
import * as ModParent from './parent'
import { resetThunkModuleMap } from './utils'

let container: HTMLDivElement | null
let root: ReactDOM.Root | null

beforeEach(() => {
  resetThunkModuleMap()

  registerThunk(ModParent)
  registerThunk(ModParent)
  registerThunk(ModChild)

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

it('many-apps-2 (useThunk)', async () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  // 2. Intercept the environment error bubble up
  const App = () => {
    const [parentID1] = useState(genID)
    const [childID0] = useState(genID)
    const [childID1] = useState(genID)
    const [childID2] = useState(genID)
    const [childID3] = useState(genID)
    const [childID4] = useState(genID)

    const [_7, doParent, parentID0] = useThunk<ModParent.State, typeof ModParent>(ModParent)
    const [_8, doChild] = useThunk<ModChild.State, typeof ModChild>(ModChild, childID0)

    console.info('many-apps2: parentID0:', parentID0, 'parentID1:', parentID1)

    // init
    useEffect(() => {
      console.log(
        'many-apps2 (init): parentID:',
        parentID0,
        'childID0:',
        childID0,
        'childID3:',
        childID3,
      )
      doChild.upsert(childID4, { count: 1 })
      doChild.remove() // remove default-id. defaultID should be childID0
      doChild.remove() // remove no-id, no default-id.
      doChild.upsert(childID0, {}) // upsert with id and empty count. setting childID0 as default. childID0 and childID4 should be defaultID. childID4 should be defaultID in the end.
      doChild.setDefaultID(childID0)
      doChild.upsert({ count: 1 }) // upsert with params only, setting default-id (childID0 and childID4) as count: 1.
      doChild.upsert(childID1) // upsert with id only. expecting early return.
      doChild.init(childID1) // init with already default-id.
      doChild.upsert(childID2, { count: 6 }) // upsert with id and count as 6.
      doChild.init(childID3) // init with already default-id.
      doChild.setDefaultID(childID3) // defaultID as childID3 and childID7. childID7 should be defaultID in the end.
      doChild.init() // init with new ID.
      doChild.update('non-exist', {}) // update with non-exist id.
      doChild.update(childID2) // update with no data.
      doChild.update({ count: 10 }) // update default-id (childID3 and childID7) count = 10.
      doChild.remove(childID1) // remove with specified id.
    }, [doParent, doChild])

    return (
      <div>
        <Parent myID={parentID0} childID0={childID0} childID1={childID1} />
        <Parent myID={parentID1} childID0={childID2} childID1={childID3} />
      </div>
    )
  }

  const App2 = () => {
    return (
      <StrictMode>
        <App />
        <App />
      </StrictMode>
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

  const childModule = getMod<ModChild.State>(ModChild.name)

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
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`) // childID3 has been removed by App2.
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

  const newParentMyIDs2 = container.querySelectorAll('.parent-my-id')
  const parentDefaultIDs3 = container.querySelectorAll('.parent-default-id')
  const parentDefaultNodeIDs3 = container.querySelectorAll('.parent-default-node-id')

  const newParentID02 = newParentMyIDs2[0].textContent
  const newParentID12 = newParentMyIDs2[1].textContent
  const newParentID22 = newParentMyIDs2[2].textContent
  const newParentID32 = newParentMyIDs2[3].textContent

  expect(newParentID02).toBe(newParentID22)
  expect(parentID0).not.toBe(newParentID02)
  expect(newParentID0).not.toBe(newParentID02)
  expect(parentID1).toBe(newParentID12)
  expect(parentID2).not.toBe(newParentID22)
  expect(newParentID2).not.toBe(newParentID22)
  expect(parentID3).toBe(newParentID32)

  const parentDefaultID3 = newParentID02

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
