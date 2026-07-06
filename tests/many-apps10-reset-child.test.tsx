import { act, StrictMode, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { genID, getMod, registerThunk } from '../src/index'
import * as ModChild from './child'
import Parent5 from './Parent5'
import * as ModParent5 from './parent5'
import { resetThunkModuleMap } from './utils'

let container: HTMLDivElement | null
let root: ReactDOM.Root | null

beforeEach(() => {
  resetThunkModuleMap()

  registerThunk(ModParent5)
  registerThunk(ModParent5)
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

it('many-apps (init and remove)', async () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  // 2. Intercept the environment error bubble up
  const App = () => {
    const [parentID0] = useState(() => genID())
    const [parentID1] = useState(() => genID())

    return (
      <div>
        <Parent5 myID={parentID0} />
        <Parent5 myID={parentID1} />
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
    root?.render(
      <StrictMode>
        <App2 />
      </StrictMode>,
    )
  })

  if (container === null) {
    return
  }

  const parentMyIDs = container.querySelectorAll('.parent-my-id')
  const parentCounts = container.querySelectorAll('.parent-count')
  const parentChildID0s = container.querySelectorAll('.parent-childID0')
  const parentChildID1s = container.querySelectorAll('.parent-childID1')
  const parentResetChild0s = container.querySelectorAll('.parent-reset-child0')
  const parentResetChild1s = container.querySelectorAll('.parent-reset-child1')
  const parentButtons = container.querySelectorAll('.parent-button')
  const parentRemoves = container.querySelectorAll('.parent-remove')

  const childMyIDs = container.querySelectorAll('.child-my-id')
  const childDefaultIDs = container.querySelectorAll('.child-default-id')
  const childCounts = container.querySelectorAll('.child-count')
  const childButtons = container.querySelectorAll('.child-button')
  const childButtons2 = container.querySelectorAll('.child-button-2')
  const childButtons3 = container.querySelectorAll('.child-button-3')

  const modParent5 = getMod<ModParent5.State>(ModParent5.name)
  const modChild = getMod<ModChild.State>(ModChild.name)

  expect(parentMyIDs.length).toBe(4)
  expect(parentCounts.length).toBe(4)
  expect(parentChildID0s.length).toBe(4)
  expect(parentChildID1s.length).toBe(4)
  expect(parentResetChild0s.length).toBe(4)
  expect(parentResetChild1s.length).toBe(4)
  expect(parentButtons.length).toBe(4)
  expect(parentRemoves.length).toBe(4)

  expect(childMyIDs.length).toBe(8)
  expect(childDefaultIDs.length).toBe(8)
  expect(childCounts.length).toBe(8)
  expect(childButtons.length).toBe(8)

  const parentID0 = parentMyIDs[0].textContent
  const parentID1 = parentMyIDs[1].textContent
  const parentID2 = parentMyIDs[2].textContent
  const parentID3 = parentMyIDs[3].textContent

  const parentChildID00 = parentChildID0s[0].textContent.split(': ')[1]
  const parentChildID01 = parentChildID0s[1].textContent.split(': ')[1]
  const parentChildID02 = parentChildID0s[2].textContent.split(': ')[1]
  const parentChildID03 = parentChildID0s[3].textContent.split(': ')[1]

  const parentChildID10 = parentChildID1s[0].textContent.split(': ')[1]
  const parentChildID11 = parentChildID1s[1].textContent.split(': ')[1]
  const parentChildID12 = parentChildID1s[2].textContent.split(': ')[1]
  const parentChildID13 = parentChildID1s[3].textContent.split(': ')[1]

  const childID0 = childMyIDs[0].textContent
  const childID1 = childMyIDs[1].textContent
  const childID2 = childMyIDs[2].textContent
  const childID3 = childMyIDs[3].textContent
  const childID4 = childMyIDs[4].textContent
  const childID5 = childMyIDs[5].textContent
  const childID6 = childMyIDs[6].textContent
  const childID7 = childMyIDs[7].textContent

  const childDefaultID = childDefaultIDs[0].textContent.split(': ')[1]

  expect(childDefaultID).toBe(`${modChild.defaultID || ''}`)
  expect(parentID0).not.toBe(`${modParent5.defaultID}`)

  expect(parentChildID0s[0].textContent).toBe(`${parentID0}: ${childID0}`)
  expect(parentChildID0s[1].textContent).toBe(`${parentID1}: ${childID2}`)
  expect(parentChildID0s[2].textContent).toBe(`${parentID2}: ${childID4}`)
  expect(parentChildID0s[3].textContent).toBe(`${parentID3}: ${childID6}`)
  expect(parentChildID1s[0].textContent).toBe(`${parentID0}: ${childID1}`)
  expect(parentChildID1s[1].textContent).toBe(`${parentID1}: ${childID3}`)
  expect(parentChildID1s[2].textContent).toBe(`${parentID2}: ${childID5}`)
  expect(parentChildID1s[3].textContent).toBe(`${parentID3}: ${childID7}`)
  expect(parentID0).not.toBe(parentID1)
  expect(parentID0).not.toBe(parentID2)
  expect(parentID0).not.toBe(parentID3)
  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
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
  expect(childID0).toBe(childID2)
  expect(childID0).toBe(childID4)
  expect(childID0).toBe(childID6)
  expect(childID0).not.toBe(childID3)
  expect(childID1).toBe(childID3)
  expect(childID1).toBe(childID5)
  expect(childID1).toBe(childID7)
  expect(childID0).toBe(parentChildID00)
  expect(childID1).toBe(parentChildID10)
  expect(childID2).toBe(parentChildID01)
  expect(childID3).toBe(parentChildID11)
  expect(childID4).toBe(parentChildID02)
  expect(childID5).toBe(parentChildID12)
  expect(childID6).toBe(parentChildID03)
  expect(childID7).toBe(parentChildID13)
  expect(childDefaultID).not.toBe(childID0)
  expect(childDefaultID).not.toBe(childID1)
  expect(childDefaultID).not.toBe(childID2)
  expect(childDefaultID).not.toBe(childID3)
  expect(childCounts[0].textContent).toBe(`${childID0}: 0`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps: to click parent-0 button (1st)')

  act(() => parentButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(consoleSpy).not.toHaveBeenCalled()

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 0`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps: to click child-0 button (1st)')
  act(() => childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(consoleSpy).not.toHaveBeenCalled()

  console.info('many-apps: to click child-0 button (2nd)')
  act(() => childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 2`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 2`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 2`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps: to click child-3 button (1st)')
  act(() => childButtons[3].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  console.info('many-apps: to click child-3 button (2nd)')
  act(() => childButtons[3].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  console.info('many-apps: to click child-3 button (3rd)')
  act(() => childButtons[3].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 3`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 2`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 2`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 3`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 2`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 3`)

  console.info('many-apps: to click child-4 button 2 (1st)')
  act(() => childButtons2[4].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps: to click child-4 button 2 (2nd)')
  act(() => childButtons2[4].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps: to click child-4 button 2 (3rd)')
  act(() => childButtons2[4].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 8`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 3`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 8`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 8`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 3`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 8`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 3`)

  console.info('many-apps: to click child-5 button 3 (1st)')
  act(() => childButtons3[5].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps: to click child-5 button 3 (2nd)')
  act(() => childButtons3[5].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  console.info('many-apps: to click child-5 button 3 (3rd)')
  act(() => childButtons3[5].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 8`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 12`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 8`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 12`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 8`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 12`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 8`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 12`)

  console.info('many-apps: to remove parent-0')
  act(() => parentRemoves[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(childDefaultID).toBe(`${modChild.defaultID || ''}`)
  expect(parentID0).not.toBe(`${modParent5.defaultID || ''}`)

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 8`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 12`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 8`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 12`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 8`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 12`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 8`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 12`)

  console.info('many-apps: to remove parent-0 (again)')
  act(() => parentRemoves[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 8`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 12`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 8`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 12`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 8`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 12`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 8`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 12`)

  console.info('many-apps: to reset parent-0 child0')
  act(() => parentResetChild0s[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  const parentChildID0s2 = container.querySelectorAll('.parent-childID0')
  const childCounts2 = container.querySelectorAll('.child-count')

  const parentChildID002 = parentChildID0s2[0].textContent.split(': ')[1]
  const parentChildID012 = parentChildID0s2[1].textContent.split(': ')[1]
  const parentChildID022 = parentChildID0s2[2].textContent.split(': ')[1]
  const parentChildID032 = parentChildID0s2[3].textContent.split(': ')[1]

  expect(childDefaultID).toBe(`${modChild.defaultID || ''}`)
  expect(parentChildID002).not.toBe(`${modChild.defaultID || ''}`)
  expect(parentID0).not.toBe(`${modParent5.defaultID || ''}`)

  expect(parentChildID002).not.toBe(parentChildID00)
  expect(parentChildID012).toBe(parentChildID01)
  expect(parentChildID022).toBe(parentChildID02)
  expect(parentChildID032).toBe(parentChildID03)

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts2[0].textContent).toBe(`${parentChildID002}: 0`)
  expect(childCounts2[1].textContent).toBe(`${childID1}: 12`)
  expect(childCounts2[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts2[3].textContent).toBe(`${childID3}: 12`)
  expect(childCounts2[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts2[5].textContent).toBe(`${childID5}: 12`)
  expect(childCounts2[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts2[7].textContent).toBe(`${childID7}: 12`)

  console.info('many-apps: to reset parent-1 child1')
  act(() => parentResetChild1s[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  const parentChildID1s2 = container.querySelectorAll('.parent-childID1')
  const childCounts3 = container.querySelectorAll('.child-count')

  const parentChildID102 = parentChildID1s2[0].textContent.split(': ')[1]
  const parentChildID112 = parentChildID1s2[1].textContent.split(': ')[1]
  const parentChildID122 = parentChildID1s2[2].textContent.split(': ')[1]
  const parentChildID132 = parentChildID1s2[3].textContent.split(': ')[1]

  expect(parentChildID002).not.toBe(`${modChild.defaultID || ''}`)
  expect(parentID0).not.toBe(`${modParent5.defaultID || ''}`)

  expect(parentChildID102).not.toBe(parentChildID10)
  expect(parentChildID112).toBe(parentChildID11)
  expect(parentChildID122).toBe(parentChildID12)
  expect(parentChildID132).toBe(parentChildID13)

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts3[0].textContent).toBe(`${parentChildID002}: 0`)
  expect(childCounts3[1].textContent).toBe(`${parentChildID102}: 0`)
  expect(childCounts3[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts3[3].textContent).toBe(`${childID3}: 12`)
  expect(childCounts3[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts3[5].textContent).toBe(`${childID5}: 12`)
  expect(childCounts3[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts3[7].textContent).toBe(`${childID7}: 12`)

  console.info('many-apps: to click parent-1 button (1st)')

  act(() => parentButtons[1].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(consoleSpy).not.toHaveBeenCalled()

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts3[0].textContent).toBe(`${parentChildID002}: 0`)
  expect(childCounts3[1].textContent).toBe(`${parentChildID102}: 0`)
  expect(childCounts3[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts3[3].textContent).toBe(`${childID3}: 12`)
  expect(childCounts3[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts3[5].textContent).toBe(`${childID5}: 12`)
  expect(childCounts3[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts3[7].textContent).toBe(`${childID7}: 12`)

  console.info('many-apps: to click child-2 button (1st)')
  const childButtons02 = container.querySelectorAll('.child-button')

  act(() => childButtons02[2].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  const childCounts4 = container.querySelectorAll('.child-count')

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts4[0].textContent).toBe(`${parentChildID002}: 0`)
  expect(childCounts4[1].textContent).toBe(`${parentChildID102}: 0`)
  expect(childCounts4[2].textContent).toBe(`${childID2}: 1`)
  expect(childCounts4[3].textContent).toBe(`${childID3}: 12`)
  expect(childCounts4[4].textContent).toBe(`${childID4}: 1`)
  expect(childCounts4[5].textContent).toBe(`${childID5}: 12`)
  expect(childCounts4[6].textContent).toBe(`${childID6}: 1`)
  expect(childCounts4[7].textContent).toBe(`${childID7}: 12`)

  console.info('many-apps: to reset parent-1 child0')
  act(() => parentResetChild0s[1].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  const parentChildID0s3 = container.querySelectorAll('.parent-childID0')
  const childCounts5 = container.querySelectorAll('.child-count')

  const parentChildID003 = parentChildID0s3[0].textContent.split(': ')[1]
  const parentChildID013 = parentChildID0s3[1].textContent.split(': ')[1]
  const parentChildID023 = parentChildID0s3[2].textContent.split(': ')[1]
  const parentChildID033 = parentChildID0s3[3].textContent.split(': ')[1]

  expect(childDefaultID).toBe(`${modChild.defaultID || ''}`)
  expect(parentChildID002).not.toBe(`${modChild.defaultID || ''}`)
  expect(parentID0).not.toBe(`${modParent5.defaultID || ''}`)

  expect(parentChildID003).toBe(parentChildID002)
  expect(parentChildID013).not.toBe(parentChildID01)
  expect(parentChildID013).not.toBe(parentChildID012)
  expect(parentChildID023).toBe(parentChildID02)
  expect(parentChildID033).toBe(parentChildID03)

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts5[0].textContent).toBe(`${parentChildID002}: 0`)
  expect(childCounts5[1].textContent).toBe(`${parentChildID102}: 0`)
  expect(childCounts5[2].textContent).toBe(`${parentChildID013}: 0`)
  expect(childCounts5[3].textContent).toBe(`${childID3}: 12`)
  expect(childCounts5[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts5[5].textContent).toBe(`${childID5}: 12`)
  expect(childCounts5[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts5[7].textContent).toBe(`${childID7}: 12`)

  expect(consoleSpy).not.toHaveBeenCalled()
})
