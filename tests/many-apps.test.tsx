import { act, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { genUUID, registerThunk, ThunkContext, type ThunkModuleToFunc, useThunk } from '../src/index'
import TheParent from './TheParent'
import * as DoChild from './theChild'
import * as DoParent from './theParent'

type TDoParent = ThunkModuleToFunc<typeof DoParent>
type TDoChild = ThunkModuleToFunc<typeof DoChild>

let container: HTMLDivElement | null
let root: ReactDOM.Root | null
beforeEach(() => {
  // @ts-expect-error ts parser error.
  registerThunk(DoParent)
  // @ts-expect-error ts parser error.
  registerThunk(DoParent)
  // @ts-expect-error ts parser error.
  registerThunk(DoChild)

  container = document.createElement('div')
  document.body.appendChild(container)

  root = ReactDOM.createRoot(container)

  // @ts-expect-error
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

it('many-parents (init and remove)', () => {
  // biome-ignore lint/complexity/noBannedTypes: Props is a required type.
  type Props = {}
  const App = (_props: Props) => {
    const [_7, doParent] = useThunk<DoParent.State, TDoParent>(DoParent)
    const [_8, doChild] = useThunk<DoChild.State, TDoChild>(DoChild)
    const [parentID0, _1] = useState(() => genUUID())
    const [parentID1, _2] = useState(() => genUUID())
    const [childID0, _3] = useState(() => genUUID())
    const [childID1, _4] = useState(() => genUUID())
    const [childID2, _5] = useState(() => genUUID())
    const [childID3, _6] = useState(() => genUUID())

    // init
    useEffect(() => {
      console.log('many-parents (init): parentID:', parentID0)
      doParent.init(parentID0)
      doParent.init(parentID1)

      doChild.init(childID0)
      doChild.init(childID1)
      doChild.init(childID2)
      doChild.init(childID3)
    }, [doParent, doChild])

    return (
      <div>
        <TheParent myID={parentID0} childID0={childID0} childID1={childID1} />
        <TheParent myID={parentID1} childID0={childID2} childID1={childID3} />
      </div>
    )
  }

  const App2 = () => {
    return (
      <ThunkContext>
        <App />
        <App />
      </ThunkContext>
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
  const parentRootIDs = container.querySelectorAll('.parent-root-id')
  const parentCounts = container.querySelectorAll('.parent-count')
  const parentButtons = container.querySelectorAll('.parent-button')
  const parentNodeIDs = container.querySelectorAll('.parent-node-id')
  const parentNodeCounts = container.querySelectorAll('.parent-node-count')
  const parentRootNodeIDs = container.querySelectorAll('.parent-root-node-id')
  const parentRootCounts = container.querySelectorAll('.parent-root-count')
  const parentRemoves = container.querySelectorAll('.parent-remove')

  const childMyIDs = container.querySelectorAll('.child-my-id')
  const childRootIDs = container.querySelectorAll('.child-root-id')
  const childCounts = container.querySelectorAll('.child-count')
  const childButtons = container.querySelectorAll('.child-button')

  expect(parentMyIDs.length).toBe(4)
  expect(parentRootIDs.length).toBe(4)
  expect(parentCounts.length).toBe(4)
  expect(parentButtons.length).toBe(4)
  expect(parentNodeIDs.length).toBe(4)
  expect(parentNodeCounts.length).toBe(4)
  expect(parentRootNodeIDs.length).toBe(4)
  expect(parentRootCounts.length).toBe(4)
  expect(parentRemoves.length).toBe(4)

  expect(childMyIDs.length).toBe(8)
  expect(childRootIDs.length).toBe(8)
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

  expect(parentRootIDs[0].textContent).toBe(`${parentID0}: ${parentID0}`)
  expect(parentRootIDs[1].textContent).toBe(`${parentID1}: ${parentID0}`)
  expect(parentRootIDs[2].textContent).toBe(`${parentID2}: ${parentID0}`)
  expect(parentRootIDs[3].textContent).toBe(`${parentID3}: ${parentID0}`)
  expect(parentRootNodeIDs[0].textContent).toBe(`${parentID0}: ${parentID0}`)
  expect(parentRootNodeIDs[1].textContent).toBe(`${parentID1}: ${parentID0}`)
  expect(parentRootNodeIDs[2].textContent).toBe(`${parentID2}: ${parentID0}`)
  expect(parentRootNodeIDs[3].textContent).toBe(`${parentID3}: ${parentID0}`)
  expect(parentID0).not.toBe(parentID1)
  expect(parentID0).not.toBe(parentID2)
  expect(parentID0).not.toBe(parentID3)
  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentRootCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentRootCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentRootCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentRootCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentButtons[0].textContent).toBe(`${parentID0}: click me`)
  expect(parentButtons[1].textContent).toBe(`${parentID1}: click me`)
  expect(parentButtons[2].textContent).toBe(`${parentID2}: click me`)
  expect(parentButtons[3].textContent).toBe(`${parentID3}: click me`)

  expect(childRootIDs[0].textContent).toBe(`${childID0}: ${childID0}`)
  expect(childRootIDs[1].textContent).toBe(`${childID1}: ${childID0}`)
  expect(childRootIDs[2].textContent).toBe(`${childID2}: ${childID0}`)
  expect(childRootIDs[3].textContent).toBe(`${childID3}: ${childID0}`)
  expect(childRootIDs[4].textContent).toBe(`${childID4}: ${childID0}`)
  expect(childRootIDs[5].textContent).toBe(`${childID5}: ${childID0}`)
  expect(childRootIDs[6].textContent).toBe(`${childID6}: ${childID0}`)
  expect(childRootIDs[7].textContent).toBe(`${childID7}: ${childID0}`)
  expect(childID0).not.toBe(childID1)
  expect(childID0).not.toBe(childID2)
  expect(childID0).not.toBe(childID3)
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

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentRootCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentRootCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentRootCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentRootCounts[3].textContent).toBe(`${parentID3}: 1`)
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
  console.info('many-apps: to click child-0 button (2nd)')
  act(() => childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentRootCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentRootCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentRootCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentRootCounts[3].textContent).toBe(`${parentID3}: 1`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 0`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
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
  expect(parentRootCounts[0].textContent).toBe(`${parentID0}: 1`)
  expect(parentRootCounts[1].textContent).toBe(`${parentID1}: 1`)
  expect(parentRootCounts[2].textContent).toBe(`${parentID2}: 1`)
  expect(parentRootCounts[3].textContent).toBe(`${parentID3}: 1`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  console.info('many-apps: to remove parent-0')
  act(() => parentRemoves[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentRootCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentRootCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentRootCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentRootCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  expect(parentRootIDs[0].textContent).toBe(`${parentID0}: `)
  expect(parentRootIDs[1].textContent).toBe(`${parentID1}: `)
  expect(parentRootIDs[2].textContent).toBe(`${parentID2}: `)
  expect(parentRootIDs[3].textContent).toBe(`${parentID3}: `)
  expect(parentRootNodeIDs[0].textContent).toBe(`${parentID0}: `)
  expect(parentRootNodeIDs[1].textContent).toBe(`${parentID1}: `)
  expect(parentRootNodeIDs[2].textContent).toBe(`${parentID2}: `)
  expect(parentRootNodeIDs[3].textContent).toBe(`${parentID3}: `)

  console.info('many-apps: to remove parent-0 (again)')
  act(() => parentRemoves[0].dispatchEvent(new MouseEvent('click', { bubbles: true })))

  expect(parentCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(parentRootCounts[0].textContent).toBe(`${parentID0}: 0`)
  expect(parentRootCounts[1].textContent).toBe(`${parentID1}: 0`)
  expect(parentRootCounts[2].textContent).toBe(`${parentID2}: 0`)
  expect(parentRootCounts[3].textContent).toBe(`${parentID3}: 0`)
  expect(childCounts[0].textContent).toBe(`${childID0}: 2`)
  expect(childCounts[1].textContent).toBe(`${childID1}: 0`)
  expect(childCounts[2].textContent).toBe(`${childID2}: 0`)
  expect(childCounts[3].textContent).toBe(`${childID3}: 3`)
  expect(childCounts[4].textContent).toBe(`${childID4}: 0`)
  expect(childCounts[5].textContent).toBe(`${childID5}: 0`)
  expect(childCounts[6].textContent).toBe(`${childID6}: 0`)
  expect(childCounts[7].textContent).toBe(`${childID7}: 0`)

  expect(parentRootIDs[0].textContent).toBe(`${parentID0}: `)
  expect(parentRootIDs[1].textContent).toBe(`${parentID1}: `)
  expect(parentRootIDs[2].textContent).toBe(`${parentID2}: `)
  expect(parentRootIDs[3].textContent).toBe(`${parentID3}: `)
  expect(parentRootNodeIDs[0].textContent).toBe(`${parentID0}: `)
  expect(parentRootNodeIDs[1].textContent).toBe(`${parentID1}: `)
  expect(parentRootNodeIDs[2].textContent).toBe(`${parentID2}: `)
  expect(parentRootNodeIDs[3].textContent).toBe(`${parentID3}: `)
})
